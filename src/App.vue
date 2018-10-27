<template>
  <div id="app">
    <div class="container">
        <div class="row justify-content-center">
            <div class="d-flex bg-light flex-column col-lg-4 col-md-5 col-sm-4">
                <div>
                    <input type="text" class="form-control col mt-2" @keyup.13="addData" v-model="todo"/>
                </div>
                <div class="col d-flex justify-content-center bg-light" v-if="loading">
                    <div class="lds-dual-ring"/>
                </div>
                <div v-else>
                    <div v-if="items.length===0"> Data Not Found</div>
                    <ul class="list-unstyled m-2" v-else>
                        <li><input type="checkbox" class="ml-2" @change="(e)=>checkAll(e)"> CheckAll</li>
                        <li v-for="item in items" :key="item.id" >
                            <div class="form-group row align-items-center justify-content-between">
                                <input type="checkbox" :checked="item.status" name="todo-check" @change="(e)=>todoCheck(e, item.id, item.name)"> 
                                <input type="text" name="edit-text" id="" class="form-control col ml-2" v-if="!item.status" :readonly="false" :value="item.name" @keyup.enter="(e)=>editToDo(item.status, e, item.id)">
                                <span class="ml-2 col" v-else><s>{{ item.name }} </s> </span>
                                <i class="material-icons ml-2" @click="removeToDo(item.id)">delete</i>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
import "bootstrap/dist/css/bootstrap.css";
import { todosRef } from "./api.js";

export default {
  name: "app",
  components: {
    HelloWorld
  },

  mounted() {
    this.todoRef = todosRef;

    this.todoRef
      .on("value", snapshot => {
        try {
          this.result = Object.entries(snapshot.val()).map(item => {
            return {
              id: item[0],
              name: item[1].name,
              status: item[1].status
            };
          });

          if (this.result) {
            this.items = this.result;
          }
          this.loading = false;
        } catch (error) {
          this.loading = false;
        }
      })
      .bind(this);
  },

  data: function() {
    return {
      todo: "",
      status: false,
      items: [],
      loading: true
    };
  },

  methods: {
    addData() {
      this.todoRef.push({
        name: this.todo,
        status: false
      });
      this.todo = "";
    },

    editToDo(status, e, id) {
      const { value } = e.target;
      this.updateTodo(!status, id, value);
    },

    removeToDo(id) {
      if (this.items.length === 1) {
        this.items = [];
      }

      this.todoRef.child(id).remove();
    },

    async updateTodo(status, id, name) {
      await this.todoRef.update({
        [id]: {
          name,
          status
        }
      });
    },

    async todoCheck(e, id, name) {
      const { checked } = e.target;

      await this.todoRef.update({
        [id]: {
          name,
          status: checked
        }
      });
    },

    async checkAll(e) {
      const { checked } = e.target;
      this.items.map(item => {
        this.updateTodo(checked, item.id, item.name);
      });
    }
  }
};
</script>

<style>

.full-height {
    height: 100%;
}
.lds-dual-ring {
  display: inline-block;
  width: 64px;
  height: 64px;
}
.lds-dual-ring:after {
  content: " ";
  display: block;
  width: 46px;
  height: 46px;
  margin: 1px;
  border-radius: 50%;
  border: 5px solid #000;
  border-color: #000 transparent #000 transparent;
  animation: lds-dual-ring 1.2s linear infinite;
}
@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
