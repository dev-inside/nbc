const Image = require("@11ty/eleventy-img");
const eleventySass = require("eleventy-sass");

module.exports = function (eleventyConfig) {

	// Thumbnail-Plugin
	eleventyConfig.addShortcode("image", async function (src, alt, sizes) {
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

		return Image.generateHTML(metadata, imageAttributes);
	});

	// SASS-Plugin
	eleventyConfig.addPlugin(eleventySass, {
		compileOptions: {
			permalink: function (contents, inputPath) {
				return (data) => data.page.filePathStem.replace(/^\/scss\//, "/css/") + ".css";
			}
		},
		sass: {
			style: "compressed",
			sourceMap: false
		},
		rev: false
	});

	// Copy img-folder including content
	eleventyConfig.addPassthroughCopy("img");

	// Set directories
	return {
		dir: {
			input: "content",
			output: "_public",
			includes: "../views",
			data: "../data"
		},
	};
};