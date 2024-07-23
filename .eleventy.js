const Image = require("@11ty/eleventy-img");

module.exports = function (eleventyConfig) {
    eleventyConfig.addShortcode("image", async function(src, alt, sizes) {
		let metadata = await Image(src, {
			widths: [300, 600, 1000],
			formats: ["webp", "jpeg"],
			outputDir: "_public/img"
		});

		let imageAttributes = {
			alt,
			sizes,
			loading: "lazy",
			decoding: "async",
		};

		// You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
		return Image.generateHTML(metadata, imageAttributes);
	});

	eleventyConfig.addPassthroughCopy("img");

    return {
        dir: {
            input: "content",
            output: "_public",
            includes: "../views",
            data: "../data"
        },
    };
};