export default {
    methods: {
        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },
        validate(formSubmitted, hasError) {
            if (!formSubmitted) {
                return ''
            }
            if (hasError) {
                return 'is-invalid'
            }
            return 'is-valid'
        },

        validateText(input) {
            if (!input.$error) {
                return ''
            }
            return input.$errors[0].$message
        },
        addZero(num) {
            return String(num).padStart(2, '0');
        },
    }
}
