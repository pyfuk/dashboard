<template>
  <div class="mt-4 container-fluid">
    <div class="row">
      <div class="col-lg-4 col-md-6 col-12">
        <card
            :title="stats.money.title"
            :value="stats.money.value"
            :percentage="stats.money.percentage"
            :iconClass="stats.money.iconClass"
            :iconBackground="stats.money.iconBackground"
            :detail="stats.money.detail"
            directionReverse
        ></card>
      </div>
      <div class="col-lg-4 col-md-6 col-12">
        <card
            :title="stats.users.title"
            :value="stats.users.value"
            :percentage="stats.users.percentage"
            :iconClass="stats.users.iconClass"
            :iconBackground="stats.users.iconBackground"
            :detail="stats.users.detail"
            directionReverse
        ></card>
      </div>
      <div class="col-lg-4 col-md-6 col-12">
        <card
            :title="stats.clients.title"
            :value="stats.clients.value"
            :percentage="stats.clients.percentage"
            :iconClass="stats.clients.iconClass"
            :iconBackground="stats.clients.iconBackground"
            :percentageColor="stats.clients.percentageColor"
            :detail="stats.clients.detail"
            directionReverse
        ></card>
      </div>
    </div>
    <div class=" row">
      <div class="col-12">
        <users-table/>
      </div>
    </div>
  </div>
</template>

<script>
import UsersTable from "../components/UsersTable";
import Card from "../../examples/Cards/Card";

export default {
  name: "users",
  components: {
    UsersTable,
    Card,
  },
  data() {
    return {
      stats: {
        money: {
          title: "Все пользователи",
          value: "53,000",
          iconClass: "ni ni-money-coins",
          iconBackground: "bg-gradient-primary",
        },
        users: {
          title: "Активные",
          value: "5,300",
          iconClass: "ni ni-world",
          iconBackground: "bg-gradient-danger",
        },
        clients: {
          title: "Новые",
          value: "+3,462",
          iconClass: "ni ni-paper-diploma",
          percentageColor: "text-danger",
          iconBackground: "bg-gradient-success",
        },
        sales: {
          title: "Sales",
          value: "$103,430",
          iconClass: "ni ni-cart",
          iconBackground: "bg-gradient-warning",
        },
      },

    }
  }
}
;
</script>
