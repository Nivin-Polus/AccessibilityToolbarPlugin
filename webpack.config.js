const path = require('path');

module.exports = {
    entry: './src/toolbar.js', // Entry point for your JS
    output: {
        filename: 'mic-access-tool.js', // Output JS file
        path: path.resolve(__dirname, 'dist'), // Output directory
        library: 'MicAccessTool', // Export as a global variable
        libraryTarget: 'umd', // Universal Module Definition
    },
    module: {
        rules: [
            {
                test: /src\/toolbar\.css$/i, // Match CSS files
                use: ['style-loader', 'css-loader'], // Use style-loader and css-loader
            },
        ],
    },
    mode: 'production', // Minify the output
};
