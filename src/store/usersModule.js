import i18n from '@/i18n.js'

export const usersModule = {
    state() {
        return {
            roles: [
                { name: i18n.global.t('users.roles.admin'), value: 'admin' },
                { name: i18n.global.t('users.roles.teacher'), value: 'teacher' },
                { name: i18n.global.t('users.roles.student'), value: 'student' }
            ]
        }
    },
    getters: {},
    mutations: {},
    actions: {},
    namespaced: true
}
