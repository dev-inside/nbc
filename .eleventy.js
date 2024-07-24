const Image = require("@11ty/eleventy-img");
const eleventySass = require("eleventy-sass");

module.exports = function (eleventyConfig) {

	/**
	 * shortcode.thumbs
	 * Adds the thumbnail-plugin as 11ty-shortcode. It resizes the given image according to the sizes defined in the thmbs array
	 * 
	 * @param {string} src	 		path of the image
	 * @param {string} alt 			alt text of the image
	 * @param {string} sizes 		srcset-sizes
	 * @param {Array} thmbs 		thmbs-sizes. If not set, it will rely on the default sizes of 300,600,1000
	 * 
	 * @returns {string} 			Renders a picture-element with the thmbs-srcset as webp and jpeg as fallback
	 */
	eleventyConfig.addShortcode("thumbs", async function (src, alt, sizes, thmbs=[300, 600, 1000]) {
		let metadata = await Image(src, {
			widths: thmbs,
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


	/**
	 * shortcode.img
	 * Renders the html img-tag
	 *
	 * @param   {string}  src       img-src
	 * @param   {string}  title     title for alt/title-tag
	 *
	 * @return  {string}            Simple HTML <img>-Tag
	 */
	eleventyConfig.addShortcode("img", function(src,title){
		return `<img src="img/${src}" title="${title}" alt="${title}" />`
	})

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