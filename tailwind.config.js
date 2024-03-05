/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            // colors: {
            //   background: "#212121",
            //   messageBubble: '#E5E7EB',
            //   messageColor:  '#D1D5DB',
            //   aiMessageBubble: "#2F2F2F"
            // }
            colors: {
                primary: {
                    100: "#F5F5F5",
                },
                secondary: {
                    100: "#2F2F2F",
                    200: "#212121",
                },
                accent: "#8A2BE2"
            },
        },
    },
    plugins: [],
};
