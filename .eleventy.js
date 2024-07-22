module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy("src/**/img");
    eleventyConfig.addPassthroughCopy("src/**/**/img");
    return {
        dir: {
            input: "pages",
            output: "_public",
            includes: "../views",
            data: "../data"
        },
    };
};