import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority"
import { LucideIcon } from "lucide-react";


// shadcn like custom component (default properties of icon badge which can be used same like any other shadcn component but here it is custom component)
const backgroundVariants = cva(
    "rounded-full flex items-center justify-center",
    {
        variants: {
            variant: {
                default: "bg-sky-100",
                success: "bg-emerald-100"
            },
            size: {
                default: "p-2",
                sm: "p-1"
            }
        },
        defaultVariants: {
            variant: "default",
            size: "default"
        }
    }
);

const iconsVariants = cva(
    "",
    {
        variants: {
            variant: {
                default: "text-sky-700",
                success: "text-emerald-700",
            },
            size: {
                default: "h-8 w-8",
                sm: "h-4 w-4",
            }
        },
        // if user does'nt pass variant as props  (default variant)
        defaultVariants: {
            variant: "default",
            size: "default"
        }
    }
);

type BackgroundVariantProps = VariantProps<typeof backgroundVariants>;
type IconVariantsProps = VariantProps<typeof iconsVariants>;

interface IconBadgeProps extends BackgroundVariantProps, IconVariantsProps{
    icon: LucideIcon;
};

const IconBadge = ({
    icon: Icon,
    variant,
    size
}: IconBadgeProps) => {
  return (
    <div className={cn(backgroundVariants({ variant, size}))}>
        <Icon className={iconsVariants({ variant, size })}/>
    </div>
  )
};

export default IconBadge