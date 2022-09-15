export default {
    methods: {
        isTeacher(user) {
            return user.role === 'teacher'
        },
        isStudent(user) {
            return user.role === 'student'
        },
        isAdmin(user) {
            return user.role === 'admin'
        },
        getTranslatedRole(role) {
            switch (role) {
                case 'student':
                    return 'Ученик'
                case 'teacher':
                    return 'Учитель'
                case 'admin':
                    return 'Админ'
                default:
                    return role
            }
        }
    }
}