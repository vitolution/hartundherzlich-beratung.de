<?php
/**
 * Setup Child Theme Styles
 */
function kadence_child_enqueue_styles() {
	wp_enqueue_style( 'kadence_child-style', get_stylesheet_directory_uri() . '/style.css', false, '1.0.0' );
}
add_action( 'wp_enqueue_scripts', 'kadence_child_enqueue_styles', 20 );

function custom_enqueue_styles() {
    wp_enqueue_style('horizontal-scroll', 
    get_stylesheet_directory_uri() . '/jub-css/horizontal-scroll.css', 
    false, 
    '1.0.0'
    );
    wp_enqueue_style('vertical-scroll-text', 
    get_stylesheet_directory_uri() . '/jub-css/vertical-scroll-text.css', 
    false, 
    '1.0.0'
    );
}
add_action('wp_enqueue_scripts', 'custom_enqueue_styles');


/**
 * Setup Child Theme Scripts
 */
function enqueue_custom_scripts() {
    wp_enqueue_script('jquery');

    wp_enqueue_script(
        'jquery-mousewheel',
        get_stylesheet_directory_uri() . '/jub-js/jquery-mousewheel-min.js',
        array('jquery'),
        null,
        true
    );
    wp_enqueue_script(
        'change-mousewheel-direction',
        get_stylesheet_directory_uri() . '/jub-js/change-mousewheel-direction.js',
        array('jquery', 'jquery-mousewheel'),
        "1.0.5",
        true
    );
    wp_enqueue_script(
        'check-viewport',
        get_stylesheet_directory_uri() . '/jub-js/check-viewport.js',
        array('jquery-mousewheel'),
        null,
        true
    );
    wp_enqueue_script(
        'side-menu-left',
        get_stylesheet_directory_uri() . '/jub-js/side-menu-left.js',
        array('jquery'),
        "1.0.1",
        true
    );
}
add_action('wp_enqueue_scripts', 'enqueue_custom_scripts');

/**
 * Setup Child Theme Palettes
 *
 * @param string $palettes registered palette json.
 * @return string
 */
function kadence_child_change_palette_defaults( $palettes ) {
	$palettes = '{"palette":[{"color":"#2B6CB0","slug":"palette1","name":"Palette Color 1"},{"color":"#215387","slug":"palette2","name":"Palette Color 2"},{"color":"#1A202C","slug":"palette3","name":"Palette Color 3"},{"color":"#2D3748","slug":"palette4","name":"Palette Color 4"},{"color":"#4A5568","slug":"palette5","name":"Palette Color 5"},{"color":"#718096","slug":"palette6","name":"Palette Color 6"},{"color":"#EDF2F7","slug":"palette7","name":"Palette Color 7"},{"color":"#F7FAFC","slug":"palette8","name":"Palette Color 8"},{"color":"#ffffff","slug":"palette9","name":"Palette Color 9"}],"second-palette":[{"color":"#2B6CB0","slug":"palette1","name":"Palette Color 1"},{"color":"#215387","slug":"palette2","name":"Palette Color 2"},{"color":"#1A202C","slug":"palette3","name":"Palette Color 3"},{"color":"#2D3748","slug":"palette4","name":"Palette Color 4"},{"color":"#4A5568","slug":"palette5","name":"Palette Color 5"},{"color":"#718096","slug":"palette6","name":"Palette Color 6"},{"color":"#EDF2F7","slug":"palette7","name":"Palette Color 7"},{"color":"#F7FAFC","slug":"palette8","name":"Palette Color 8"},{"color":"#ffffff","slug":"palette9","name":"Palette Color 9"}],"third-palette":[{"color":"#2B6CB0","slug":"palette1","name":"Palette Color 1"},{"color":"#215387","slug":"palette2","name":"Palette Color 2"},{"color":"#1A202C","slug":"palette3","name":"Palette Color 3"},{"color":"#2D3748","slug":"palette4","name":"Palette Color 4"},{"color":"#4A5568","slug":"palette5","name":"Palette Color 5"},{"color":"#718096","slug":"palette6","name":"Palette Color 6"},{"color":"#EDF2F7","slug":"palette7","name":"Palette Color 7"},{"color":"#F7FAFC","slug":"palette8","name":"Palette Color 8"},{"color":"#ffffff","slug":"palette9","name":"Palette Color 9"}],"active":"palette"}';
	return $palettes;
}
add_filter( 'kadence_global_palette_defaults', 'kadence_child_change_palette_defaults', 20 );

/**
 * Setup Child Theme Defaults
 *
 * @param array $defaults registered option defaults with kadence theme.
 * @return array
 */
function kadence_child_change_option_defaults( $defaults ) {
	$new_defaults = '[]';
	$new_defaults = json_decode( $new_defaults, true );
	return wp_parse_args( $new_defaults, $defaults );
}
add_filter( 'kadence_theme_options_defaults', 'kadence_child_change_option_defaults', 20 );

function add_custom_colors() {
	$directory = get_stylesheet_directory_uri();
	wp_admin_css_color( 'jungundbilligSchema', __( 'Jung&Billig' ),
	$directory . '/customColors/jungundbillig/colors.min.css',
	array( '#333333', '#404040', '#ffd354', '#d9ac26' )
	);
}
add_action('admin_init', 'add_custom_colors');

// Disable support for comments and trackbacks in post types
function df_disable_comments_post_types_support() {
	$post_types = get_post_types();
	foreach ( $post_types as $post_type ) {
		if ( post_type_supports( $post_type, 'comments' ) ) {
			remove_post_type_support( $post_type, 'comments' );
			remove_post_type_support( $post_type, 'trackbacks' );
		}
	}
}
add_action( 'admin_init', 'df_disable_comments_post_types_support' );


// Close comments on the front-end
function df_disable_comments_status() {
	return false;
}
add_filter( 'comments_open', 'df_disable_comments_status', 20, 2 );
add_filter( 'pings_open', 'df_disable_comments_status', 20, 2 );


// Hide existing comments
function df_disable_comments_hide_existing_comments( $comments ) {
	$comments = array();
	return $comments;
}
add_filter( 'comments_array', 'df_disable_comments_hide_existing_comments', 10, 2 );


// Remove comments page in menu
function df_disable_comments_admin_menu() {
	remove_menu_page( 'edit-comments.php' );
}
add_action( 'admin_menu', 'df_disable_comments_admin_menu' );


// Redirect any user trying to access comments page
function df_disable_comments_admin_menu_redirect() {
	global $pagenow;
	if ( $pagenow === 'edit-comments.php' ) {
		wp_redirect( admin_url() );
		exit;
	}
}
add_action( 'admin_init', 'df_disable_comments_admin_menu_redirect' );


// Remove comments metabox from dashboard
function df_disable_comments_dashboard() {
	remove_meta_box( 'dashboard_recent_comments', 'dashboard', 'normal' );
}
add_action( 'admin_init', 'df_disable_comments_dashboard' );


// Remove comments links from admin bar
function df_disable_comments_admin_bar() {
	if ( is_admin_bar_showing() ) {
		remove_action( 'admin_bar_menu', 'wp_admin_bar_comments_menu', 60 );
	}
}
add_action( 'init', 'df_disable_comments_admin_bar' );

function add_gtm_body() {
  ?>
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-W2VS6GQC"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
  <?php
}
add_action('wp_body_open', 'add_gtm_body');


function disable_emojis() {
    remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
    remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
    remove_action( 'wp_print_styles', 'print_emoji_styles' );
    remove_action( 'admin_print_styles', 'print_emoji_styles' ); 
    remove_filter( 'the_content_feed', 'wp_staticize_emoji' );
    remove_filter( 'comment_text_rss', 'wp_staticize_emoji' ); 
    remove_filter( 'wp_mail', 'wp_staticize_emoji_for_email' );
    add_filter( 'tiny_mce_plugins', 'disable_emojis_tinymce' );
    add_filter( 'wp_resource_hints', 'disable_emojis_remove_dns_prefetch', 10, 2 );
}
add_action( 'init', 'disable_emojis' );

/**
* Filter function used to remove the tinymce emoji plugin.
* 
* @param array $plugins 
* @return array Difference betwen the two arrays
*/
function disable_emojis_tinymce( $plugins ) {
    if ( is_array( $plugins ) ) {
        return array_diff( $plugins, array( 'wpemoji' ) );
    } else {
        return array();
    }
}

/**
* Remove emoji CDN hostname from DNS prefetching hints.
*
* @param array $urls URLs to print for resource hints.
* @param string $relation_type The relation type the URLs are printed for.
* @return array Difference betwen the two arrays.
*/
function disable_emojis_remove_dns_prefetch( $urls, $relation_type ) {
    if ( 'dns-prefetch' == $relation_type ) {
        /** This filter is documented in wp-includes/formatting.php */
        $emoji_svg_url = apply_filters( 'emoji_svg_url', 'https://s.w.org/images/core/emoji/2/svg/' );

        $urls = array_diff( $urls, array( $emoji_svg_url ) );
    }

    return $urls;
}

require_once get_stylesheet_directory() . '/inc/title-tags.php';