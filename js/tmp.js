var Tmp = {
	load : '<div class="load">努力加载中...</div>',
	card : '\
		<dt url="detail" did="#did" uid="#uid">\
			<div class="img">\
				<img class="logo" src="#logo"/><img class="vip#vip" src="img/tuijian.png"/>\
			</div>\
			<div class="text">\
				<div class="tit">#title</div>\
				<div class="phone">\
					<span>#phone</span>\
					<span class="star">\
					<span class="viewNum">#stars</span>\
					<span class="view">人浏览</span></span>\
				</div>\
				<div class="area">#address</div>\
			</div>\
			<br class="cb"/>\
		</dt>\
	',
	goods : '\
		<dt url="goods" goods_id="#goods_id" car_id="#car_id"> \
			<div class="logo"><span j="1"><img class="headimg" j="1" src="#headimgurl"><br /><img class="vip" src="img/other/goods.png"></span></div> \
			<div class="text"> \
				<p class="tit starting"><span j="1"><img src="img/other/in.png"> #starting</span></p> \
				<p class="tit destination"><span j="1"><img src="img/other/out.png"> #destination</span></p> \
				<p class="remark" title="#rmktitle"><span j="1">#remark</span></p> \
			</div> \
			<div class="contact"> \
				#time2 <br /> \
				<img class="cimg" phone="#phone" user_id="#user_id" src="img/other/dialup.png"> \
			</div>\
			<br class="cb" />\
		</dt>\
	',
	blog : '\
		<dt did="#id"> \
			<div class="photo flt"><img class="logo" src="#headimgurl" /><img class="vip" src="img/blog/vip.png" /></div> \
			<div class="tit flt"> \
				<p>#nickname</p> \
				<p class="time">#ctime</p> \
			</div> \
			<br class="cb"/> \
			<div class="text">\
				<div class="title">#content</div> \
				<div class="img" i="#ii">#pictures</div> \
			</div> \
			<div class="see"> \
				#viewers \
			</div> \
			<div class="action"> \
				<a class="click" tp="like"><img class="left" src="img/blog/like.png" /><span>#like_num</span></a> <img class="left" src="img/blog/talk.png" /><span>#comment_num</span> <img class="left" src="img/blog/share.png" /> \
			</div> \
		</dt>\
	'
}