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
	eleventyConfig.addShortcode("thumbs", async function (src, alt, sizes, thmbs = [400, 600, 1000], cls = false, style = false, loading = "lazy") {
		let metadata = await Image(src, {
			widths: thmbs,
			formats: ["avif", "webp"],
			outputDir: "_public/img/",
		});

		let imageAttributes = {
			alt,
			title: alt,
			sizes,
			loading: loading,
		};

		if (cls) {
			imageAttributes.class = cls;
		}

		if (style) {
			imageAttributes.style = style;
		}

		if (loading){
			imageAttributes.decoding = "async";
		}

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
	eleventyConfig.addShortcode("img", function (src, title, cls = false, style = false) {
		return `<img src="img/${src}" title="${title}" alt="${title}" ${cls ? `class="${cls}"` : ''} ${style ? `style="${style}"` : ''}/>`
	})

	/**
	 * shortcode.btn
	 * Renders an ahref with a button-class
	 *
	 * @param   {string}  href      href
	 * @param   {string}  title     title
	 * @param   {string}  btn       html-class for button
	 *
	 * @return  {string}            Simple link/button helper
	 */
	eleventyConfig.addShortcode("btn", function (href, title, btn = "btn") {
		return `<a href="${href}" alt="${title}" class="${btn}">${title}</a>`
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
			sourceMap: false,
		},
		rev: false
	});


	// Copy img-folder including content
	eleventyConfig.addPassthroughCopy("img");
	// Copy "Figtree"-Font
	eleventyConfig.addPassthroughCopy({ "./node_modules/@fontsource-variable/figtree/files/*.woff2": "_assets/fonts" });


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