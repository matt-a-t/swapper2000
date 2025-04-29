<template>
  <div class="gradient-layer">
    <div class="fish-layer">
      <div class="gradient-layer">
        <div class="fish-layer fish-2"></div>
      </div>
    </div>
  </div>
  <div id="container">
    <NuxtPage />
  </div>
</template>

<style>
.gradient-layer {
  height: 100vh;
  width: 100vw;
  position: absolute;
}

.gradient-layer::before {
  background: linear-gradient(to right, #0fe5e5 0%, #00ff00 100%);
  content: "";
  height: 100%;
  width: 100%;
  position: absolute;
  z-index: 0;
  opacity: 0.5;
}

.fish-layer {
  background: url("/fish-pair.png") 0 0 repeat;
  background-size: 100px;
  height: 100vh;
  width: 100vw;
  position: absolute;
  animation: fish 20s linear infinite;
}

@keyframes fish {
  0% {
    background-position: 0 0;
  }
  25% {
    background-position: 100px 100px;
  }
  50% {
    background-position: -100px -100px;
  }
  75% {
    background-position: 100px 0;
  }
  100% {
    background-position: 0 0;
  }
}

.fish-2 {
  background-position: 35px 60px;
  opacity: 0.7;
  animation: fish-2 20s linear infinite;
}

@keyframes fish-2 {
  0% {
    background-position: 35px 60px;
  }
  15% {
    background-position: 135px 160px;
  }
  50% {
    background-position: -65px -40px;
  }
  85% {
    background-position: 135px 60px;
  }
  100% {
    background-position: 35px 60px;
  }
}

#container {
  position: relative;
  z-index: 1;
  overflow-y: auto;
  height: 100vh;
}
</style>
