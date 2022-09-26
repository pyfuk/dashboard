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
        getI18nRole(role) {
            if (role == 'admin') {
                return this.$t('users.roles.admin')
            }
            if (role == 'teacher') {
                return this.$t('users.roles.teacher')
            }
            return this.$t('users.roles.student')
        }
    }
}
