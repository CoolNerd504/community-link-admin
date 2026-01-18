import { Video, MoreVertical, Clock, DollarSign, Edit, Trash } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

interface ServiceCardProps {
    service: any
    onEdit: (service: any) => void
    onDelete: (id: string) => void
}

export function ServiceCard({ service, onEdit, onDelete }: ServiceCardProps) {
    return (
        <div className="bg-white rounded-[20px] border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div className="size-12 bg-purple-50 rounded-[12px] flex items-center justify-center text-purple-600">
                        <Video className="size-6" />
                    </div>
                    <div>
                        <h4 className="text-[16px] font-bold text-gray-900 mb-1">{service.title}</h4>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-gray-100 text-gray-600">
                            {service.category}
                        </span>
                    </div>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger className="size-8 flex items-center justify-center rounded-full hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors">
                        <MoreVertical className="size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 rounded-[12px]">
                        <DropdownMenuItem onClick={() => onEdit(service)} className="text-[14px]">
                            <Edit className="size-4 mr-2" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(service.id)} className="text-[14px] text-red-600 focus:text-red-600 focus:bg-red-50">
                            <Trash className="size-4 mr-2" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <p className="mt-4 text-[14px] text-gray-500 line-clamp-2 min-h-[40px]">
                {service.description}
            </p>

            <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-1.5 text-[14px] font-semibold text-gray-900">
                    <DollarSign className="size-4 text-gray-400" />
                    {service.price} ZMW
                </div>
                <div className="flex items-center gap-1.5 text-[13px] text-gray-500">
                    <Clock className="size-4 text-gray-400" />
                    {service.duration} mins
                </div>
            </div>
        </div>
    )
}
