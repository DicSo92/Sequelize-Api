<template>
    <div class="Signup flex-col items-center">
        <div class="mx-24">
            <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 text-left">
                <div class="w-full rounded bg-red-400 text-white p-2 mb-4"
                     v-if="error.error">
                    Error: {{error.msg}}
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
                        Username
                    </label>
                    <input class="shadow appearance-none border rounded w-full py-2 px-3 mb-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                           id="username" type="text" placeholder="Username"
                           :class="validUsername ? '' : 'border-red-500'"
                           v-model="username">
                    <p class="text-gray-500 text-xs italic">Between 4 and 16 character</p>
                    <p class="text-red-500 text-xs italic"
                       v-if="!validUsername">
                        Username must be between 4 and 16 character !
                    </p>
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
                        Email
                    </label>
                    <input class="shadow appearance-none border rounded w-full py-2 px-3 mb-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                           id="Email" type="email" placeholder="Email"
                           :class="validEmail ? '' : 'border-red-500'"
                           v-model="email">
                    <p class="text-gray-500 text-xs italic">Enter your email address</p>
                    <p class="text-red-500 text-xs italic" v-if="!validEmail">Invalid Email</p>
                </div>
                <div class="mb-6">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
                        Password
                    </label>
                    <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline"
                           :class="validPassword ? '' : 'border-red-500'"
                           id="password" type="password" placeholder="******************"
                           v-model="password">
                    <p class="text-gray-500 text-xs italic">1 lowercase, 1 uppercase, 1 number, min: 6, max: 15</p>
                    <p class="text-red-500 text-xs italic" v-if="!validPassword">Password doesn't match conditions !</p>
                </div>
                <div class="flex items-center justify-between">
                    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="button"
                            @click="signUp">
                        Sign Up
                    </button>
                    <a class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
                        Sign In
                    </a>
                </div>
            </form>
            <p class="text-center text-gray-500 text-xs">
                &copy;2020 Acme Corp. All rights reserved.
            </p>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Signup",
        data() {
            return {
                loading: false,
                error: {
                    error: false,
                    msg: null
                },
                email: '',
                username: '',
                password: ''
            }
        },
        computed: {
            validEmail() {
                const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                return emailRegex.test(this.email) || this.email.length === 0
            },
            validUsername() {
                return this.username.length <= 16 && this.username.length >= 4 || this.username.length === 0
            },
            validPassword() {
                const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$/
                return passwordRegex.test(this.password) || this.password.length === 0
            }
        },
        methods: {
            signUp() {
                this.loading = true
                this.$axios.post(`http://localhost:8080/auth/signup/`, {
                    email: this.email,
                    username: this.username,
                    password: this.password
                })
                    .then(response => {
                        console.log(response.data)
                        this.$router.push({name: 'home'})
                        this.loading = false
                    })
                    .catch(error => {
                        this.error = error.response.data
                        console.log(error)
                    })
            }
        }
    }
</script>

<style scoped>

</style>
