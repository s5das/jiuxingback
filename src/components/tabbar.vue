<template>
    <div class="main">
        <div class="logo"><img src="@/assets/logo.png"></div>
        <div class="nav">
            <div class="nav-item" v-for="(item,index) in tabInfo" :key="index" @click="changeTab(index)">
                <div>{{item.title}}</div>
                <div :class="{'mark':true,'selected':selected==index}"></div>
            </div>
        </div>
    </div>
</template>
<script>
import { ref } from 'vue'
// import { ElMessage } from 'element-plus'
export default {
    name: 'TabBar',
    setup() {
        let selected = ref(0)
        let tabInfo = ref([
            {
                title:'测试结果'
            }
        ])

        const changeTab= (index) => {
             selected.value=index
            //  ElMessage({
            //     message:index,
            //     type:'success'
            //  })
        }
        return {
            selected,
            tabInfo,
            changeTab
        }
    }
}
</script>
<style lang="less" scoped>
.main {
    height: 80px;
    background-color: #3f4140;
    display: flex;
    align-items: center;
    .logo {
        margin-left: 100px;
        height: 60px;

        img {
            height: 100%;
            width: auto;
        }
    }

    .nav {
        color: white;
        width: 100px;
        display: flex;
        margin-left: 100px;

        .nav-item {
            flex: 1;
            height: 80px;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;

        }

        .nav-item:hover .mark {
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            height: 0;
            width: 0;
            border-bottom: 6px solid #fff;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
        }

        .selected {
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            height: 0;
            width: 0;
            border-bottom: 6px solid #fff;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
        }
    }
}

</style>