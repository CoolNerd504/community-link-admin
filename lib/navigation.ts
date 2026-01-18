export const getDashboardPath = (role?: string | null) => {
    if (!role) return "/dashboard"

    switch (role) {
        case "ADMIN":
        case "SUPER_ADMIN":
            return "/admin/dashboard"
        case "PROVIDER":
            return "/provider/dashboard"
        case "USER":
            return "/user/dashboard"
        default:
            return "/user/dashboard"
    }
}
