import { isTeacher } from "@/actions/teacher";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import Mux from "@mux/mux-node";
import { NextResponse } from "next/server";


// ------------------------------------     COURSE EDIT &  DELETE ROUTE --------------------------------
const { Video } = new Mux(
    process.env.MUX_TOKEN_ID!,
    process.env.MUX_TOKEN_SECRET!
)
export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const { userId } = auth();
        const { courseId } = params; // extract course id from params
        const values = await req.json();
        if (!userId || !isTeacher(userId)) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const course = await db.course.update({
            where: {
                id: courseId,
                userId
            },
            data: {
                ...values,
            }
        });
        return NextResponse.json(course);
    } catch (error) {
        console.log("[COURSE_ID]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}


export async function DELETE(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const { userId } = auth();
        if (!userId || !isTeacher(userId)) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        // delete chapters related to course
        const course = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId,
            },
            include: {
                chapters: {
                    include: {
                        muxData: true,
                    }
                }
            }
        });

        if(!course){
            return new NextResponse("Not found", { status: 404 });
        }

        // delete mux videos
        for (const chapter of course.chapters){
            if(chapter.muxData?.assetId){
                await Video.Assets.del(chapter.muxData.assetId);
            }
        }

        const deletedCourse = await db.course.delete({
            where: {
                id: params.courseId,
            }
        });

        return NextResponse.json(deletedCourse);

    } catch (error) {
        console.log("[COURSE_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

