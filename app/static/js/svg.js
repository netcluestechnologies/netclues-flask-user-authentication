var iconArray = {
    'cross': '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="512" height="512" x="0" y="0" viewBox="0 0 365.717 365" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><g fill="#f44336"><path d="M356.34 296.348 69.727 9.734c-12.5-12.5-32.766-12.5-45.247 0L9.375 24.816c-12.5 12.504-12.5 32.77 0 45.25L295.988 356.68c12.504 12.5 32.77 12.5 45.25 0l15.082-15.082c12.524-12.48 12.524-32.75.02-45.25zm0 0" fill="#ff0000" opacity="1" data-original="#f44336" class=""></path><path d="M295.988 9.734 9.375 296.348c-12.5 12.5-12.5 32.77 0 45.25l15.082 15.082c12.504 12.5 32.77 12.5 45.25 0L356.34 70.086c12.504-12.5 12.504-32.766 0-45.246L341.258 9.758c-12.5-12.524-32.766-12.524-45.27-.024zm0 0" fill="#ff0000" opacity="1" data-original="#f44336" class=""></path></g></g></svg>',
    'right': '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="512" height="512" x="0" y="0" viewBox="0 0 417.813 417" style="enable-background:new 0 0 512 512" xml:space="preserve" class="hovered-paths"><g><path d="M159.988 318.582c-3.988 4.012-9.43 6.25-15.082 6.25s-11.094-2.238-15.082-6.25L9.375 198.113c-12.5-12.5-12.5-32.77 0-45.246l15.082-15.086c12.504-12.5 32.75-12.5 45.25 0l75.2 75.203L348.104 9.781c12.504-12.5 32.77-12.5 45.25 0l15.082 15.086c12.5 12.5 12.5 32.766 0 45.246zm0 0" fill="#4caf50" opacity="1" data-original="#000000" class="hovered-path"></path></g></svg>',
}


function svgIcon () {
    $(".n-icon").each(function() {
        var dataIcon = $(this).data("icon");
        var dataIconWidth = $(this).data("iconwidth");
        var dataIconHeight = $(this).data("iconheight");
        if(dataIcon in iconArray){
            $(this).html(iconArray[dataIcon]);
            $(this).find('svg').css({"width": dataIconWidth, "height": dataIconHeight});
        } else {
            console.log(dataIcon + ": This icon(s) does not exists")
        }
    });
}

svgIcon();

/* setInterval(function () {
    svgIcon();
}, 1000); */

/* HTML Example: <i class="n-icon" data-icon="s-x" data-iconwidth="24px" data-iconheight="24px"></i> */