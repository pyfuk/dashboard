export const usersModule = {
    state() {
        return {
            roles: [
                { name: 'Админ', value: 'admin' },
                { name: 'Учитель', value: 'teacher' },
                { name: 'Ученик', value: 'student' }
            ]
        }
    },
    getters: {},
    mutations: {},
    actions: {},
    namespaced: true
}