<template >
    <div class="main">
        <el-form :model="form" label-width="120px">
            <el-form-item label="账号:">
                <el-input v-model="form.username" />
            </el-form-item>
            <el-form-item label="密码:">
                <el-input type="password" v-model="form.password" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit(form)">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import { reactive } from 'vue'
import { logIn } from '@/http/api/backapi'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
export default {
    name: "LogIn",
    setup() {
        const router = useRouter()
        const form = reactive({
            username: '',
            password: ''
        })
        const onSubmit = (formEl) => {

            logIn(formEl).then(
                (res) => {
                    localStorage.setItem('token', res.data.access_token)
                    router.push({
                        path: '/mainpage'
                    })
                },
                () => {
                    ElMessage({
                        message: '账号或密码错误',
                        type: 'warning',
                    })
                }
            )


        }
        return {
            form,
            onSubmit
        }
    }
}
</script>
<style lang="less" scoped>
.main {
    width: 500px;
    margin: 200px auto;
}
</style>