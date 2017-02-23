"use strict";

document.body.style.border = "5px solid #333333";


var blockToolPopup = document.createElement('div');
blockToolPopup.style = "position:absolute;width:100px;height:20px;background:#333333;left:0px;top:0px;z-index:65535";

function handleMouseOver(event) {
    event.stopPropagation();
    var weiboinfo = extractWeiboCard(this);
    blockToolPopup.style.top = this.offsetTop+"px";
    console.log(this.offsetTop+"px");
    this.appendChild(blockToolPopup);
}

function handleMouseOut(event){
    event.stopPropagation();
    this.removeChild(blockToolPopup);
}