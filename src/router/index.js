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
import PageNotFound from "@/views/PageNotFound";
import Subject from "@/views/Subjects/Subject";
import SubjectProfile from "@/views/Subjects/SubjectProfile";
import SubjectSchedule from "@/views/Subjects/SubjectSchedule";
import SubjectScheduleAdd from "@/views/Subjects/SubjectScheduleAdd";
import Courses from "@/views/Courses/Course";

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
            {
                path: "lessons/course/edit/:course",
                name: "EditCourse",
                component: AddLesson,
                props: {
                    edit: 'course'
                }
            },
            {
                path: "lessons/lesson/edit/:lesson",
                name: "EditLesson",
                component: AddLesson,
                props: {
                    edit: 'lesson'
                }
            }
        ]

    },
    {
        path: "/subjects",
        name: "Subjects",
        component: Subjects,
    },
    {
        path: "/subjects/:id",
        name: "Subject",
        component: Subject,
        children: [
            {
                path: "",
                component: SubjectProfile
            },
            {
                path: "edit",
                name: 'SubjectProfile',
                component: SubjectProfile
            },
            {
                path: "schedule",
                name: 'SubjectSchedule',
                component: SubjectSchedule
            },
            {
                path: "schedule/add",
                name: "SubjectScheduleAdd",
                component: SubjectScheduleAdd,
            },
        ]
    },
    {
        path: "/courses/:id",
        name: "Courses",
        component: Courses,
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
    { path: "/:pathMatch(.*)*", component: PageNotFound }

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
