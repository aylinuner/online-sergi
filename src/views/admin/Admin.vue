<template>
<Navbar/>
<div class="container">
    <router-view/>

</div>
</template>

<script>
import Navbar from '@/components/admin/AdminNavbar.vue'
export default {
    components:{Navbar}

}
</script>

<style>

</style>