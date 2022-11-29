module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "node" : true
    },
    "extends": [
        "eslint:recommended",
        "plugin:vue/vue3-essential"
    ],
    "overrides": [
        {
            files: ['src/**/index.vue'],
            rules: {
                'vue/multi-word-component-names': "off",
            }
        }
    ],
    "parserOptions": {
        "parser": "babel-eslint",
        "ecmaVersion": 12,
        "sourceType": "module",
        "allowImportExportEverywhere": true,
        "ecmaFeatures": {
            "modules": true,
            "legacyDecorator": true
        }
    },
    "plugins": [
        "vue"
    ],
    "rules": {
    }
}
