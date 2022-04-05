# Welcome to Master UI
This npm package is a collection of UI design to work with laravel aplications using inersia js with vue 3 js, by default it use daisy ui, more info about daisy ui [here](https://daisyui.com/), that required to have tailwind css installed, if you want a laravel application ready to use please check [here](https://github.com/mariojgt/skeleton) the skeleton package comes with login for admin and front end ready to be use with 2 steps verification out of the box, it can be fully customize or event you can use the package as a skeleton for your project, the package is open source and can be used in any way you want.

## Installation

```bash
npm i @mariojgt/masterui
```
## How to use
There is some few components to use, buy they will be added as they need, fell free to do any request and help us to improve this package.

## Text input
In your vue component you can use the text input component like this:

```vue
<template>
    <input-field
        v-model="email"
        label="Email"
        type="email"
        name="email"
        id="email"
        placeholder="type your email"
    />
</template>

<script setup>
// Import the from components
import InputField from "@mariojgt/masterui/packages/Input/index";

</script>
```

## Password Input
In your vue component you can use the text input component like this:

```vue
<template>
    <input-password
        v-model="email"
        label="Email"
        type="email"
        name="email"
        id="email"
        placeholder="type your email"
    />
</template>

<script setup>
// Import the from components
import InputField from "@mariojgt/masterui/packages/Input/index";

</script>
```

## LinkButton
In your vue component you can use the text input component like this:

```vue
<template>
    <LinkButton name="Login" :link="loginLink" />
</template>

<script setup>
// Import the from components
import LinkButton from "@mariojgt/masterui/packages/Link/index";

</script>
```

## Button Submit
In your vue component you can use the text input component like this:

```vue
<template>
    <Submit name="Login" :link="loginLink" />
</template>

<script setup>
// Import the from components
import Submit from "@mariojgt/masterui/packages/Submit/index";

</script>
```
