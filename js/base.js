var Base = (function(){
	var _obj = {},
		_init = {},
		_city = {name:'上海',start:'上海',end:'全国'},
		_getCity = function(n){
			var s = n.split(' ');
			return s[1] || s[0]
		},
		_get = function(){
			var name = _getCity(_city.name),
				start = _getCity(_city.start),
				end = _getCity(_city.end)
			;
			$('#cityname').text(name);
			$('#start').text(start);
			$('#end').text(end);
			if(start!='全国') _config.index.data.starting = start;
			if(end!='全国') _config.index.data.destination = end;
			if(_city.tp=='start' || _city.tp=='end'){
				_obj.query({clear:1});
			}
		},
		_getSize = function(x){
			document.getElementById('html').style.fontSize = document.body.clientWidth*x+'px';
		},
		_getRequest = function() {
		   var url = window.location.search; //获取url中"?"符后的字串   
		   var theRequest = new Object();   
		   if (url.indexOf("?") != -1) {   
			  var str = url.substr(1);   
			  strs = str.split("&");   
			  for(var i = 0; i < strs.length; i ++) {
				 theRequest[strs[i].split("=")[0]]=decodeURI(strs[i].split("=")[1]);
			  }   
		   }
		   return theRequest;   
		},
		_req = function(){
			var req = _getRequest();
			if(!req.url) req.url = 'index';
			return req;
		}(),
		_load = function(url,o,suc){
			$.ajax({
				url : url,
				success : function(temp){
					o.html(temp);
					_obj.mvvm(o);
					suc && suc();
				}
			})
		},
		_config = {
			active : _req.url,
			card_id : _req.card_id,
			car_id : _req.car_id,
			goods_id : _req.goods_id,
			user_id : _req.user_id,
			o : $('#main')
		}
	;
	_config.index = {
		menu : 1,
		clear : function(){
			$('dl.menus>dt.active').removeClass('active');
			$('dl.menus>dt').eq(0).addClass('active');
			_config.index.url = '/page/index';
		},
		suc : function(){
			_get();
			_obj.query();
			_obj.cityBind();
			$('dl.topMenu dt').click(function(){
				var o = $(this);
				_config.active = o.attr('url');
				_obj.location(_config.active);
			})
			$('#search-choice').click(function(){
				$('#searchBox').toggleClass('hide');
			})
		},
		url : '/page/index',
		tempUrl : 'home.html',
		data : {sort:130},
		temp : Tmp.card,
		o : '#card1',
		turn : 1,
		rData : function(d,j){
			d = d.replace('#did',j.id).replace('#uid',j.uid).replace('#stars',j.view).replace('#title',j.title).replace('#phone',j.phone).replace('#view',j.view).replace('#address',j.address);
			if(j.is_vip=='1') d = d.replace('#vip','');
			else d = d.replace('#vip',' hide');
			d = d.replace('#renzheng',' hide');
			if(j.logo) d = d.replace('#logo',j.logo);
			else d = d.replace('#logo','http://www.chawuliu.com/uploads/page/default9d665cfbf7bbd3834f7accbeaeea423b.jpg');
			return d;
		},
		bind : function(obj){
			obj.click(function(){
				var o = $(this),
					url = o.attr('url'),
					card_id = o.attr('did'),
					user_id = o.attr('uid')
				;
				_config.active = o.attr('url');
				_req.card_id = card_id;
				_req.user_id = user_id;
				_obj.location(_config.active+'&card_id='+card_id+'&user_id='+user_id);
			})
		}
	};
	_config.list = {
		url : '/page/index',
		tempUrl : 'list.html',
		suc : function(){
			_obj.query();
			$('#search-choice').click(function(){
				$('#searchBox').toggleClass('hide');
			})
			$('#area-choice').click(function(){
				$('#areaBox').toggleClass('hide');
			})
		},
		o : 'dl.card',
		data : {sort:130},
		temp : Tmp.card,
		turn : 1,
		rData : _config.index.rData,
		bind : _config.index.bind
	};
	_config.blog = {
		url : '/shuoshuo',
		tempUrl : 'blog.html',
		suc : function(){
			_get();
			_obj.query();
			_obj.cityBind();
			$('#search-choice').click(function(){
				$('#searchBox').toggleClass('hide');
			})
			$('#area-choice').click(function(){
				$('#areaBox').toggleClass('hide');
			})
		},
		o : 'dl.blog',
		data : {},
		temp : Tmp.blog,
		turn : 1,
		tools : {
			getImages : function(pic,id){
				var obj = this,htm = '',plist = [];
				if(pic.length>0){
					plist = pic.split(',');
					$.each(plist,function(k,i){
						var src = 'http://www.chawuliu.com/uploads/'+i;
						var img = new Image();
						img.src = src;
						img.onload = function(){
							var o1 = $('.img[i="'+id+'"] img').eq(k);
							o1.attr('src',src)
							if(img.width>img.height) o1.css('height','100%');
							else o1.css('width','100%');
						};
						//if(k<3) 
						htm += '<span><img class="jui-auto-img" src="" /></span>';
					})
					htm += '<br class="cb" />';
				}
				return htm;
			},
			getViewers : function(pic){
				var htm = '';
				for(var p in pic) htm += '<img src="'+pic[p].headimgurl+'" />';
				return htm;
			},
		},
		rData : function(d,j){
			var obj = this;
			return d.replace('#ctime',Base.tools.past_time(j.ctime)).replace('#user_id',j.user_id).replace('#ii',j.id).replace('#id',j.id).replace('#id',j.id).replace('#headimgurl',j.user_info[0] && j.user_info[0].headimgurl).replace('#nickname',j.user_info[0] && j.user_info[0].nickname).replace('#content',Base.tools.sub(j.content,200)).replace('#pictures',_config.blog.tools.getImages(j.pictures,j.id)).replace('#view_num',j.view_num).replace('#viewers',_config.blog.tools.getViewers(j.viewers)).replace('#like_num',j.like_num).replace('#comment_num',j.comment_num);
		},
		bind : function(obj){
			obj.find('img.openBlog').click(function(){
				$(this).parent().find('.openBox').toggleClass('hide');
			})
			obj.find('a[tp="talk"]').click(function(){
				$('.leave').toggleClass('hide');
				$('.leave input').focus();
			})
			/*obj.find('dt').last().find('a.click').click(function(){
				var o = $(this),
					tp = o.attr('tp'),
					dt = o.parent().parent()
				;
				if(tp=='like'){
					var numo = o.find('span'),
						num = parseInt(numo.text())
					;
					$.ajax({
						url: '/shuoshuo/like/' + dt.attr('did'),
						data:{},
						dataType: 'json',
						success : function(dd) {
							num ++;
							if(dd.info=='点赞成功') numo.text(num);
							alert(dd.info);
						}
					})
				}
				else if(tp='talk'){
					location.href = $(this).attr('htm');
				}
			})*/
		}
	};
	_config.goods = {
		url : '/viewgoods',
		tempUrl : 'goods.html',
		suc : function(){
			_obj.query();
		},
		o : 'dl.goods',
		data : {},
		temp : Tmp.goods,
		turn : 1,
		rData : function(d,j){
			var numList = j.remark.match(/[0-9]+/ig),
				remark = j.remark,
				phone = '';
			if(numList){
				$.each(numList,function(k,j){
					if(j.length>5) {
						phone = j;
						remark = remark.replace(phone.substring(3,9),'***');
					}
				})
			};
			d=d.replace('#remark',remark).replace('#rmktitle',j.remark).replace('#car_id',j.car_id).replace('#goods_id',j.goods_id).replace('#user_id',j.user_id).replace('#phone',j.phone).replace('#headimgurl',j.user_info[0].headimgurl).replace('#starting',j.starting).replace('#destination',j.destination).replace('#time1',Base.tools.int_to_str(j.ctime)).replace('#time2',Base.tools.past_time(j.ctime));
			return d;
		},
		bind : function(obj){
			obj.find('.cimg').click(function(){
				$('.consult').toggleClass('hide');
				var o = $(this),
					phone = o.attr('phone'),
					cnt1 = $('.consult>a[d="0"]'),
					cnt2 = $('.consult>a[d="1"]')
				;
				if(phone=='-1'){
					cnt2.css('color','#ccc');
					cnt2.attr('href','#');
				}else{
					cnt2.css('color','#fff');
					cnt2.attr('href','tel:'+phone);
				}
				cnt1.attr('href','talk.html?id='+o.attr('user_id'));
			})
			obj.find('[j="1"]').click(function(){
				var dt = $(this).parent().parent().parent(),
					car_id = dt.attr('car_id'),
					goods_id = dt.attr('goods_id');
				_config.active = 'gdetail';
				_config.car_id = car_id;
				_config.goods_id = goods_id;
				_obj.location(_config.active+'&car_id='+car_id+'&goods_id='+goods_id);
			})
		}
	};
	_config.gdetail = {
		tempUrl : 'gdetail.html',
		suc : function(){
			
		},
	};
	_config.detail = {
		leaveDom : '\
			<dt>\
				<div class="flt heads">\
					<img id="logo1" src="#headimgurl" />\
				</div>\
				<div class="frt txt">\
					<div class="up">#nickname <span>#ctime</span></div>\
					<div class="down">#message</div>\
				</div>\
				<br class="cb"/>\
			</dt>\
		',
		suc : function(get){
			$('a.back').click(function(){
				_config.active = 'index';
				_obj.location(_config.active);
			})
			$.ajax({
				url: '/detail2/'+_req.card_id,
				dataType: 'json',
				success : function(dd) {
					if(!get){
						$('#title').text(dd.page.title);
						if(dd.page.is_vip=='1') $('#is_vip').show();
						else $('#is_vip').hide();
						$('#phones').text(dd.page.phone.replace('-','-'));
						$('#hot').text(dd.page.hot);
						$('#view').text(dd.page.view);
						$('#address').text(dd.page.address);
						$('#logo').attr('src',dd.page.logo);
						$('#logo_share').attr('src',dd.page.logo);
						$('#onlinec').attr('htm','mdetail.html?id='+_req.user_id);
						$('#phonec').attr('href','tel:'+dd.page.phone);
						$('#ctime').text(_obj.tools.int_to_str(dd.page.ctime));
						$('.seoTitle').text(dd.page.title);
						(function(){
							var qrcode = new QRCode(document.getElementById("qrcode"), {
								width : 300,//设置宽高
								height : 300
							});
							qrcode.makeCode(location.href); //location.protocol + "//" + location.host + "/lottery/pos.html?id=" + did
						})();
						var cnt = dd.page.content,
							tmp = '<p style="color:#FF8500;line-height:22px">#insert</p>';
						if(dd.page.isMember>0){
							$('#viplogo').show();
							cnt += tmp.replace('#insert',dd.tip4);
						}
						$('#contents').html(cnt);
					}
					//留言
					var mc = dd.message_count,
						msgs = dd.messages;
					$('#viewNum').text(mc);
					$('#dtail').html(function(){
						var htm = '',
							tmp = _config.detail.leaveDom;
						for(var k in msgs) {
							var m = msgs[k];
							htm += tmp.replace('#message',m.message).replace('#ctime',_obj.tools.int_to_str(m.ctime)).replace('#headimgurl',m.user_info[0].headimgurl).replace('#nickname',m.user_info[0].nickname);
						}
						return htm;
					});
					$('#dtail>dt').gt(0).hide();
					$('#stars').html(getStar(mc));
					$('.jsLoad').removeClass('hide');
				},
				error:function(jqXHR,textStatus) {
					log(' request failed'+textStatus);
				}
			});
		},
		tempUrl : 'detail.html',
	};
	_config.my = {
		tempUrl : 'my.html',
	};
	_config.price = {
		tempUrl : 'price.html',
	};
	return {
		getCity : function(){
			$('.choiceCity .city-menu a.active').removeClass('active');
			$('.choiceCity .city-menu a[i="0"]').addClass('active');
			$('.choiceCity .city-data.active').removeClass('active');
			$('.choiceCity .city-data[i="0"]').addClass('active');
			$('.choiceCity .city-data[i="0"]').html(function(){
				var dom = '<dt><p class="number"><span>#number</span></p><p class="citys">#citys</p></dt>',
					htm = '',
					citys = '';
				for(var c in ChineseDistricts[86]){
					citys = '';
					htm += dom.replace('#number',c);
					for(var k in ChineseDistricts[86][c]){
						var t = ChineseDistricts[86][c][k];
						citys += '<a title="'+t.address+'" code="'+t.code+'">'+_obj.simpCity(t.address)+'</a>';
					}
					htm = htm.replace('#citys',citys);
				}
				return htm;
			})
			return _obj;
		},
		cityBind : function(){
			$('.words a').click(function(){
				_city[_city.tp] = $(this).text();
				_get();
				$('#areaBox').toggleClass('hide');
			})
			$('.choice').click(function(){
				$('#areaBox').toggleClass('hide');
				var k = $(this).attr('k');
				_city.tp = k;
				_city.fromCity = _city[k].split(' ');
				_obj.getCity();
				if(_city.fromCity.length==1) _city.fromCity = ['','',''];
				$('.city-title a').each(function(k,i){
					var txt = _city.fromCity[k],
						ni = k+1,
						o = $('.choiceCity .city-data[i="'+k+'"] a[title="'+txt+'"]');
					$(i).text(txt);
					o.addClass('active');
					if(ni<=2){
						var sons = ChineseDistricts[o.attr('code')];
						$('.choiceCity .city-data[i="'+ni+'"]').html(function(){
							var htm = '<dt><p class="citys">';
							for(var t in sons) htm += '<a title="'+sons[t]+'" code="'+t+'">'+sons[t]+'</a>';
							htm += '</p></dt>';
							return htm;
						})
					}
				})
				//$('.choiceCity').show().css({top:'100%'}).animate({top:'0.74rem'});
			})
			$('.choiceCity .city-menu a').click(function(){
				var o = $(this),
					i = o.attr('i');
				o.parent().find('.active').removeClass('active');
				o.addClass('active');
				$('.choiceCity .city-data.active').removeClass('active');
				$('.choiceCity .city-data[i="'+i+'"]').addClass('active');
			})
			$('.choiceCity .city-ok a').click(function(){
				var o = $(this),
					txt = o.text();
				if(txt=='确定'){
					_city[_city.tp] = _city.fromCity.join(' ').trim();
					_get();
				}else if(txt=='取消') {
					
				}
				$('#areaBox').toggleClass('hide');
				//$('.choiceCity').animate({top:'100%'},function(){
				//	$(this).hide().css({top:'0.74rem'});
				//})
			})
			$('.choiceCity .city-data').click(function(e){
				var tar = e.target,
					o = $(tar),
					i = parseInt($('.choiceCity .city-menu a.active').attr('i')),
					ni = i+1,
					isr = 0
				;
				if(tar.nodeName.toLowerCase()==='a'){
					var txt = o.text();
					if(txt==_city.fromCity[i]) {
						_city.fromCity[i] = '';
						o.removeClass('active');
						isr = 1;
					}else{
						_city.fromCity[i] = txt
						o.parent().find('.active').removeClass('active');
						o.addClass('active');
					}
					if(ni<=2) {
						_city.fromCity[ni] = '';
						$('.choiceCity .city-data[i="'+ni+'"]').empty();
					}
					if(ni==1) {
						_city.fromCity[ni+1] = '';
						$('.choiceCity .city-data[i="'+(ni+1)+'"]').empty();
					}
					$('.city-title a').each(function(k,i){
						$(i).text(_city.fromCity[k]);
					})
					if(isr==1) return;
					if(ni<=2){
						var sons = ChineseDistricts[o.attr('code')];
						$('.choiceCity .city-menu a.active').removeClass('active');
						$('.choiceCity .city-menu a[i="'+ni+'"]').addClass('active');
						$('.choiceCity .city-data.active').removeClass('active');
						$('.choiceCity .city-data[i="'+ni+'"]').addClass('active');
						$('.choiceCity .city-data[i="'+ni+'"]').html(function(){
							var htm = '<dt><p class="citys">';
							for(var t in sons) htm += '<a title="'+sons[t]+'" code="'+t+'">'+_obj.simpCity(sons[t])+'</a>';
							htm += '</p></dt>';
							return htm;
						})
					}
				}
			})
		},
		simpCity : function(r){
			if (r.length>=6){
				r = r.replace('苏柯尔克孜','');
				r = r.replace('哈萨克族','');
			}
			if (r.length>=5){
				r = r.replace('保安族 ','');
				r = r.replace('哈萨克','');
				r = r.replace('自治区','');
				r = r.replace('自治州','');
				r = r.replace('自治县','');
				r = r.replace('自治旗','');
				r = r.replace('联合旗','');
				r = r.replace('斡尔族','');
				r = r.replace('维吾尔','');
				r = r.replace('自治州','');
				r = r.replace('布依族','');
				r = r.replace('朝鲜族','');
				r = r.replace('土家族','');
				r = r.replace('蒙古族','');
				r = r.replace('仡佬族','');
				r = r.replace('仫佬族','');
				r = r.replace('毛南族','');
				r = r.replace('哈尼族','');
				r = r.replace('傈僳族','');
				r = r.replace('纳西族','');
				r = r.replace('拉祜族','');
				r = r.replace('布朗族','');
				r = r.replace('景颇族','');
				r = r.replace('独龙族','');
				r = r.replace('普米族','');
				r = r.replace('裕固族','');
				r = r.replace('撒拉族','');
			}
			if (r.length>=5){
				r = r.replace('东乡族','');
			}
			if (r.length>=4){
				r = r.replace('林区','');
				r = r.replace('前旗','');
				r = r.replace('沁旗','');
				r = r.replace('中旗','');
				r = r.replace('后旗','');
				r = r.replace('左旗','');
				r = r.replace('右旗','');
				r = r.replace('各族','');
				r = r.replace('畲族','');
				r = r.replace('满族','');
				r = r.replace('瑶族','');
				r = r.replace('侗族','');
				r = r.replace('苗族','');
				r = r.replace('壮族','');
				r = r.replace('回族','');
				r = r.replace('藏族','');
				r = r.replace('黎族','');
				r = r.replace('彝族','');
				r = r.replace('羌族','');
				r = r.replace('侗族','');
				r = r.replace('水族','');
				r = r.replace('傣族','');
				r = r.replace('白族','');
				r = r.replace('佤族','');
				r = r.replace('怒族','');
				r = r.replace('土族','');
				r = r.replace('土族','');
				r = r.replace('土族','');
				r = r.replace('地区','');
			}
			if (r.length>=4){
				r = r.replace('左翼','');
				r = r.replace('右翼','');
				r = r.replace('蒙古','');
			}
			if (r.length>=3){
				r = r.replace('县','');
				r = r.replace('省','');
			}
			if (r.length>=3){
				r = r.replace('区','');
			}
			if (r.length>=3){
				r = r.replace('市','')
			}
			return r;
		},
		mvvm : function(object){
			//增加或删除active
			object.find('[jui-click="active"]').each(function(k,i){
				var o = $(i),
					obj,
					tar = o.attr('jui-tar'), //点击元素
					to = o.attr('jui-to'), //直接目标元素
					son = o.attr('jui-son'), //子类目标元素
					pr = parseInt(o.attr('jui-prt')) || 0, //父类目标元素
					r = o.attr('jui-repeat'), //是否唯一
					k = o.attr('jui-callback') //回调函数
				;
				if(tar) obj = o.find(tar);
				else obj = o;
				obj.click(function(){
					var ob = $(this),
						prs = ob; //目标元素
					if(to){
						prs = $(to);
					}
					else if(son){
						prs = o.find(son);
					}
					else if(pr>0){
						for(var i=0;i<pr;i++) prs = prs.parent();
					}
					if(!r) o.find(tar+'.active').removeClass('active');
					if(prs.hasClass('active')) prs.removeClass('active');
					else prs.addClass('active');
					_init.callback[k] && _init.callback[k](ob);
				})
			})
			//切换tab切换div
			object.find('[jui-click="change-box"]').each(function(k,i){
				var ts = $(i),
					s = ts.attr('jui-tar'),
					to = ts.attr('jui-to'),
					obj = ts.find(s),
					k = ts.attr('jui-callback') //回调函数
				;
				obj.click(function(){
					var o = $(this),
						i = o.attr('i');
					ts.find('.active').removeClass('active');
					o.addClass('active');
					$('.'+to+'.active').removeClass('active');
					$('.'+to+'[i="'+i+'"]').addClass('active');
					_init.callback[k] && _init.callback[k](o);
				})
			})
		},
		tools : {
			str_to_int : function(d){
				return (new Date(Date.parse(d.replace(/-/g, "/"))).getTime()+'').substr(0, 10);
			},
			toDouble : function(d){
				if((d+'').length==1) return '0'+d;
				return d;
			},
			addDate : function(dd,dadd){
				var a = new Date(dd)
				a = a.valueOf()
				a = a + dadd * 24 * 60 * 60 * 1000
				a = new Date(a)
				return a;
			},
			past_time : function(d){
				var ntm = parseInt(new Date().getTime()/1000),
					td = ntm - d,
					day = parseInt(td/(3600*24)),
					bk = ''
				;
				if(day>3) bk = day + '天前';
				else if(day>2) bk = '前天';
				else if(day>1) bk = '昨天';
				else{
					var hour = parseInt(td/3600);
					if(hour>1) bk = hour + '小时前';
					else bk = parseInt(td/60) + '分钟前';
					if(parseInt(td/60)==0) bk = td + '秒前';
				}
				return bk;
			},
			sub : function(s,l){
				if(s.length>l) s = s.substring(0,l-3)+'...';
				return s;
			},
			int_to_str : function(d,arg) {
				var dt = new Date(parseInt(d) * 1000)
					back = '';
				if(arg==1) back = this.toDouble(dt.getHours())+':'+this.toDouble(dt.getMinutes());
				else back = dt.getFullYear()+'-'+this.toDouble(dt.getMonth()+1)+'-'+this.toDouble(dt.getDate());
				return back;
			},
			arrayRemove : function(list,s){var lb=[],x = list.indexOf(s);for(var i in list){if(i!=x){lb.push(list[i])}}return lb},
			getQueryString : function(key){
				var reg = new RegExp("(^|&)"+key+"=([^&]*)(&|$)");
				var result = window.location.search.substr(1).match(reg);
				return result?decodeURIComponent(result[2]):null;
			},
			getRequest : function() {
				   var url = window.location.search; //获取url中"?"符后的字串   
				   var theRequest = new Object();   
				   if (url.indexOf("?") != -1) {   
					  var str = url.substr(1);   
					  strs = str.split("&");   
					  for(var i = 0; i < strs.length; i ++) {   
						  //就是这句的问题
						 theRequest[strs[i].split("=")[0]]=decodeURI(strs[i].split("=")[1]); 
						 //之前用了unescape()
						 //才会出现乱码  
					  }   
				   }   
				   return theRequest;
			}
		},
		turn : {
			is : 0,
			page : 1,
			end : 0,
			getScrollTop : function() {
				var scrollTop = 0; 
				if (document.documentElement && document.documentElement.scrollTop) { 
				scrollTop = document.documentElement.scrollTop; 
				} 
				else if (document.body) { 
				scrollTop = document.body.scrollTop; 
				} 
				return scrollTop; 
			},
			getClientHeight : function() { //获取当前可是范围的高度 
				var clientHeight = 0; 
				if (document.body.clientHeight && document.documentElement.clientHeight) { 
				clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight); 
				} 
				else { 
				clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight); 
				} 
				return clientHeight; 
			},
			getScrollHeight : function() { //获取文档完整的高度 
				return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight); 
			},
			get : function(suc){
				window.onscroll = function () { 
					if (_obj.turn.getScrollTop() + _obj.turn.getClientHeight() == _obj.turn.getScrollHeight()) {
						_obj.turn.page ++;
						if(_config[_config.active].turn==1){
							suc && suc();
						}
					} 
				}
			}
		},
		query : function(q){
			var q = q || {};
			if(_obj.turn.is==0 && _obj.turn.end==0){
				_obj.turn.is = 1;
				var atv = _config[_config.active],
					obj = q.o || $(atv.o),
					rData = q.rData || atv.rData,
					bind = q.bind || atv.bind
				;
				if(q.clear==1) obj.empty();
				obj.append(Tmp.load);
				atv.data.page = _obj.turn.page;
				$.ajax({
					url : q.url || atv.url,
					data : atv.data,
					dataType : 'json',
					success : function(back){
						var lst = back.list || back.page_list || back;
						if(lst.length>0){
							for(var i=0;i<lst.length;i++) {
								obj.append(rData(q.tmp || atv.temp,lst[i]));
								bind(obj.find('dt').last());
							}
						}
						else {
							_obj.turn.end = 1;
						}
						obj.find('.load').remove();
						_obj.turn.is = 0;
					}
				})
			}
		},
		load : function(){
			_load(_config[_config.active].tempUrl,_config.o,function(){
				if(_config[_config.active].turn==1){
					_obj.turn.get(function(){
						_obj.query();
					});
				}
				_config[_config.active].suc && _config[_config.active].suc();
			})
		},
		pageClear : function(){
			_obj.turn.is = 0;
			_obj.turn.page = 1;
			_obj.turn.end = 0;
			return _obj;
		},
		location : function(url){
			if(url=='index') {
				history.pushState('rl','','index.html');
				_config[_config.active].clear && _config[_config.active].clear();
			}
			else history.pushState('rl','','?url='+url);
			_obj.pageClear().load();
		},
		func : function(wd){
			wd.log = function(){for(var arg in arguments) console && console.log(arguments[arg])};
			wd.str = function(d){return JSON && JSON.stringify(d) || d};
			wd.json = function(d){return JSON && JSON.parse(d) || d};
		},
		init : function(){
			_obj = this;
			_obj.func(window);
			_init = {
				callback : {
					menu1 : function(o){
						var url = o.attr('url'),
							box = o.attr('box'),
							q = {clear:1,url:url,o:$(box)}
						;
						if(url=='/viewcar') {
							$('dl.card').removeClass('card').addClass('goods');
							q.tmp = Tmp.goods;
							q.rData = _config.goods.rData;
							q.bind = _config.goods.bind;
						}else{
							$('dl.goods').removeClass('goods').addClass('card');
						}
						_obj.pageClear().query(q);
					}
				}
			};
			_getSize(100/320);
			_obj.load();
			$('footer dl dt').click(function(){
				var o = $(this);
				_config.active = o.attr('url');
				if(_config.active){
					_obj.location(_config.active);
				};
			})
			$('body').append('<a href="javascript:window.location.reload()" style="position:fixed;top:0.4rem;right:0;z-index:99;display:block;width:50px;height:50px"></a>');
		}
	}
})();

Base.init();