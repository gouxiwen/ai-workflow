<template>
  <div class="home-root">
    <nav class="nav">
      <RouterLink class="nav-btn" to="/workflow">工作流</RouterLink>
      <RouterLink class="nav-btn" to="/VForm3/lowcode">VForm3低代码</RouterLink>
      <RouterLink class="nav-btn" to="/VForm3/preview">VForm3预览</RouterLink>
    </nav>
    <main class="main">
      <Suspense>
        <RouterView />
      </Suspense>
    </main>
  </div>
</template>

<script setup>
import { Suspense } from "vue";
</script>

<style lang="less" scoped>
.home-root {
  display: flex;
  flex-direction: column;
  height: 100vh;
  .nav {
    display: flex;
    align-items: center;
    height: 30px;
    background-color: #ffffff;
    gap: 10px;
    .nav-btn {
      color: #000;
    }
    .router-link-active {
      color: #5584ff;
    }
  }
  .main {
    flex: 1;
    height: calc(100% - 30px);
    background-color: #f0f2f5;
    overflow: auto;
    padding: 16px;
  }
}
</style>
