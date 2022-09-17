import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Tables from "../views/Tables.vue";
import Billing from "../views/Billing.vue";
import VirtualReality from "../views/VirtualReality.vue";
import RTL from "../views/Rtl.vue";
import Profile from "../views/Profile.vue";
import Signup from "../views/Signup.vue";
import Signin from "../views/Signin.vue";
import Users from "../views/Users/Users";
import User from "../views/Users/User";
import UserLessons from "../views/Users/UserLessons";
import Calendar from "../views/Calendar/Calendar";

import store from '../store/index'
import UserCalendar from "../views/Users/UserCalendar";
import UserProfile from "../views/Users/UserProfile";
import Subjects from "../views/Subjects/Subjects";
import AddLesson from "../views/Lessons/AddLesson";
import UserAdd from "../views/Users/UserAdd";

const routes = [
    {
        path: "/",
        name: "/",
        redirect: "/dashboard-default",
    },
    {
        path: "/dashboard-default",
        name: "Dashboard",
        component: Dashboard,
    },
    {
        path: "/tables",
        name: "Tables",
        component: Tables,
    },
    {
        path: "/users",
        name: "Users",
        component: Users,
    },
    {
        path: "/users/add",
        name: "Add User",
        component: UserAdd,
    },
    {
        path: "/users/:id/",
        name: "User",
        component: User,
        children: [
            {
                path: "",
                component: UserProfile
            },
            {
                path: "edit",
                name: 'UserEdit',
                component: UserProfile
            },
            {
                path: "lessons",
                name: 'UserLessons',
                component: UserLessons
            },
            {
                path: "calendar",
                name: "UserCalendar",
                component: UserCalendar
            },
            {
                path: "lessons/add",
                name: "UserLessonsAdd",
                component: AddLesson,
            },
        ]

    },
    {
        path: "/subjects",
        name: "Subjects",
        component: Subjects,
    },
    {
        path: "/calendar",
        name: "Calendar",
        component: Calendar,
    },
    {
        path: "/billing",
        name: "Billing",
        component: Billing,
    },
    {
        path: "/virtual-reality",
        name: "Virtual Reality",
        component: VirtualReality,
    },
    {
        path: "/rtl-page",
        name: "RTL",
        component: RTL,
    },
    {
        path: "/profile",
        name: "Profile",
        component: Profile,
    },
    {
        path: "/signin",
        name: "Signin",
        component: Signin,
        beforeEnter: [checkAuthInSignin]
    },
    {
        path: "/signup",
        name: "Signup",
        component: Signup,
    },

];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
    linkActiveClass: "active",
});

router.beforeEach((to) => {
    if (
        !store.state.isAuth &&
        to.name !== 'Signin'
    ) {
        return { name: 'Signin' }
    }
})

function checkAuthInSignin() {
    if (store.state.isAuth) {
        return { path: '/' }
    }
}

export default router;