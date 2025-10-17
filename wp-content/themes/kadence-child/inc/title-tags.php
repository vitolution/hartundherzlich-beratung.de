<?php
add_filter('render_block', 'add_title_to_kadence_nav_links', 10, 2);

function add_title_to_kadence_nav_links($block_content, $block) {
    // Check if it's a Kadence navigation block
    if (!empty($block['blockName']) && strpos($block['blockName'], 'kadence/navigation') !== false) {
        libxml_use_internal_errors(true); 
        $dom = new DOMDocument();
        $dom->loadHTML('<?xml encoding="utf-8" ?>' . $block_content, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);

        $links = $dom->getElementsByTagName('a');
        foreach ($links as $link) {
            if ($link->hasAttribute('class') && strpos($link->getAttribute('class'), 'kb-nav-link-content') !== false) {
                if (!$link->hasAttribute('title')) {
                    $text = trim($link->textContent); //adjust the text here
                    if (!empty($text)) {
                        $link->setAttribute('title', $text);
                    }
                }
            }
        }
        return $dom->saveHTML();
    }

    return $block_content;
}
?>