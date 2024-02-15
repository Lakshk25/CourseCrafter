import { Category, Chapter, Course } from "@prisma/client";
import { db } from "@/lib/db"
import { getProgress } from "./get-progress";

type CoursewithProgressWithCategory = Course & {
    category: Category;
    chapters: Chapter[];
    progress: number | null;
}

type getDashboardCourses = {
    completedCourses: CoursewithProgressWithCategory[];
    coursesInProgress: CoursewithProgressWithCategory[];
}
export const getDashboardCourses = async (userId: string): Promise<getDashboardCourses> => {
    try {
        const purchasedCourses = await db.purchase.findMany({
            where: {
                userId: userId,
            },
            select: {
                course: {
                    include: {
                        category: true,
                        chapters: {
                            where: {
                                isPublished: true
                            }
                        }
                    }
                }
            }
        });

        const courses = purchasedCourses.map((purchase) => purchase.course) as CoursewithProgressWithCategory[];

        for (let course of courses){
            const progress = await getProgress(userId, course.id);
            course["progress"] = progress;
        }

        const completedCourses = courses.filter((course) => course.progress === 100);
        // If the progress is less than 100 or if the progress is undefined (using the nullish coalescing operator ??), the course is included in the filtered result
        const coursesInProgress = courses.filter((course) => (course.progress ?? 0) < 100);

        return {
            completedCourses,
            coursesInProgress
        }
    } catch (error) {
        console.log("[GET_DASHBOARD_COURSES]", error);
        return {
            completedCourses: [],
            coursesInProgress: [],
        }
    }
}