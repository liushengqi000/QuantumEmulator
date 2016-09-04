/*
https://quantumexperience.ng.bluemix.net/qstage/
Example Multi7x7Mod15:
  qua=new quaBuilder();
  qua.init(4).x(1).x(2).x(3).x(0).x(1).x(2).x(3).cx(2,1).cx(1,2).cx(2,1).cx(1,0).cx(0,1).cx(1,0).cx(3,0).cx(0,3).cx(3,0).show()
//9*7mod15=(9^15)>>1+((9^15)&1)<<3
*/

var quaBuilder=function(){
	var status,bytes,quas;
}
quaBuilder.prototype=(function(){
	var i,j,k;
	function probC(a){
		return Math.pow(a[0],2)+2*Math.pow(a[1],2)+Math.pow(a[2],2)+2*Math.pow(a[3],2)+(a[0]*a[1]+a[2]*a[3])*2*Math.sqrt(2);
	}
	function strC(a){
		return "["+a[0]+(a[1]<0?"":"+")+a[1]+"*sqrt(2)]+["+a[2]+(a[3]<0?"":"+")+a[3]+"*sqrt(2)]i";
	}
	function strQ(a){
		if(isNaN(a[0][0])||isNaN(a[0][1])||isNaN(a[0][2])||isNaN(a[0][3])||isNaN(a[1][0])||isNaN(a[1][1])||isNaN(a[1][2])||isNaN(a[1][3]))
		return {"value":"cnot",
			"theta*2":"cnot",
			"delta":"cnot",
			"phi":"cnot",
			"X":"cnot",
			"Y":"cnot",
			"Z":"cnot"
		}
		var theta=Math.acos(
			Math.sqrt(
				Math.pow(a[0][0]+a[0][1]*Math.sqrt(2),2)+
				Math.pow(a[0][2]+a[0][3]*Math.sqrt(2),2)
			)
		);
		var delta=Math.acos(
			(a[0][0]+a[0][1]*Math.sqrt(2))/
			Math.cos(theta)
		)
		if((a[0][2]+a[0][3]*Math.sqrt(2))<0)delta=-delta;
		var phi=Math.acos(
			(a[1][0]+a[1][1]*Math.sqrt(2))/
			Math.cos(theta)
		);
		if((a[1][2]+a[1][3]*Math.sqrt(2))<0)phi=-phi;
		phi-=delta;
		if(phi<0)phi+=2*Math.PI;
		return {"value":"{"+strC(a[0])+"}|0>+{"+strC(a[1])+"}|1>",
			"theta*2":(theta*2),
			"delta":delta,
			"phi":phi,
			"X":Math.sin(theta*2)*Math.cos(phi),
			"Y":Math.sin(theta*2)*Math.sin(phi),
			"Z":Math.cos(theta*2)
		}
	}
	function dec2bin(a,b){
		return ("0".repeat(b)+a.toString(2)).substr(-b);
	}

	function mulC(a,b){
		return [
			a[0]*b[0]+2*a[1]*b[1]-a[2]*b[2]-2*a[3]*b[3],
			a[0]*b[1]+a[1]*b[0]-a[2]*b[3]-a[3]*b[2],
			a[0]*b[2]+a[2]*b[0]+2*a[1]*b[3]+2*a[3]*b[1],
			a[0]*b[3]+a[3]*b[0]+a[1]*b[2]+a[2]*b[1]
		];
        }
	function addC(a,b){
		return [a[0]+b[0],a[1]+b[1],a[2]+b[2],a[3]+b[3]];
        }
	function subC(a,b){
		return [a[0]-b[0],a[1]-b[1],a[2]-b[2],a[3]-b[3]];
        }
	function exC(a,b,ex){
		var tmp0,tmp1;
		tmp0=addC(mulC(a,ex[0][0]),mulC(b,ex[0][1]));
		tmp1=addC(mulC(a,ex[1][0]),mulC(b,ex[1][1]));
		return [tmp0,tmp1];
	}
	function singleGate(target,ex){
		var tmp,mask=1<<(this.bytes-target-1);
		for(var i=0;i<this.status.length;i++){
			if(i&mask)continue;
			tmp=exC(this.status[i],this.status[i|mask],ex);
			this.status[i]=tmp[0];
			this.status[i|mask]=tmp[1];
		}
		tmp=exC(this.quas[target][0],this.quas[target][1],ex);
		this.quas[target][0]=tmp[0];
		this.quas[target][1]=tmp[1];
	}
	return {
		init:function(byteNum){
			this.bytes=byteNum?byteNum:5
			this.status=[];
			this.quas=[];
			for(var i=0;i<(1<<this.bytes);i++){
				this.status.push([0,0,0,0]);
			}
			for(var i=0;i<this.bytes;i++){
				this.quas.push([[1,0,0,0],[0,0,0,0]])//a|0>+b|1>
			}	
			this.status[0]=[1,0,0,0];
			return this;
		},
		show:function(){
			var tmp={};
			tmp.quas=[];
			tmp.status=[];
			for(var i=0;i<this.status.length;i++){
				tmp.status[dec2bin(i,this.bytes)]=probC(this.status[i])+","+strC(this.status[i]);
			}
			for(var i=0;i<this.quas.length;i++){
				tmp.quas[i]=strQ(this.quas[i]);
			}
			console.dir(tmp);
		},
		x:function(target){
			singleGate.apply(this,[target,[
				[[0,0,0,0],[1,0,0,0]],
				[[1,0,0,0],[0,0,0,0]]
			]]);
			return this;
		},
		y:function(target){
			singleGate.apply(this,[target,[
				[[0,0,0,0],[0,0,-1,0]],
				[[0,0,1,0],[0,0,0,0]]
			]]);
			return this;
		},
		z:function(target){
			singleGate.apply(this,[target,[
				[[1,0,0,0],[0,0,0,0]],
				[[0,0,0,0],[-1,0,0,0]]
			]]);
			return this;
		},
		s:function(target){
			singleGate.apply(this,[target,[
				[[1,0,0,0],[0,0,0,0]],
				[[0,0,0,0],[0,0,1,0]]
			]]);
			return this;
		},
		sdg:function(target){
			singleGate.apply(this,[target,[
				[[1,0,0,0],[0,0,0,0]],
				[[0,0,0,0],[0,0,-1,0]]
			]]);
			return this;
		},
		t:function(target){
			singleGate.apply(this,[target,[
				[[1,0,0,0],[0,0,0,0]],
				[[0,0,0,0],[0,0.5,0,0.5]]
			]]);
			return this;
		},
		tdg:function(target){
			singleGate.apply(this,[target,[
				[[1,0,0,0],[0,0,0,0]],
				[[0,0,0,0],[0,0.5,0,-0.5]]
			]]);
			return this;
		},
		h:function(target){
			singleGate.apply(this,[target,[
				[[0,0.5,0,0],[0,0.5,0,0]],
				[[0,0.5,0,0],[0,-0.5,0,0]]
			]]);
			return this;
		},
		cx:function(control,target){
			var maskc=(1<<(this.bytes-control-1)),maskt=(1<<(this.bytes-target-1)),tmp;
			//var div="start";
			for(var i=0;i<this.status.length;i++){
				if((i&maskc)==0||(i&maskt))continue;
				tmp=exC(this.status[i],this.status[i|maskt],[
					[[0,0,0,0],[1,0,0,0]],
					[[1,0,0,0],[0,0,0,0]]
				]);
				this.status[i]=tmp[0];
				this.status[i|maskt]=tmp[1];
				/*if(div==="end")continue;
				if(div==="start"){
					div=[this.status[i],this.status[i|maskt]];
				}else{
					if(mulC(div[0],this.status[i|maskt]).toString()!==mulC(div[1],this.status[i]).toString())
						div="end";
				}*/
			}
			/*if(div!=="end"){
				div[0]=[div[0][0]+div[0][1]*Math.sqrt(2),div[0][2]+div[0][3]*Math.sqrt(2)];
				div[1]=[div[1][0]+div[1][1]*Math.sqrt(2),div[1][2]+div[1][3]*Math.sqrt(2)];
				div[2]=[div[0][0]+div[1][0],div[0][1]+div[1][1]];
				this.quas[target]=[
					[
						(div[0][0]*div[2][0]+div[0][1]*div[2][1])/(div[2][0]*div[2][0]+div[2][1]*div[2][1]),0,
						(div[0][1]*div[2][0]-div[0][0]*div[2][1])/(div[2][0]*div[2][0]+div[2][1]*div[2][1]),0
					],
					[
						(div[1][0]*div[2][0]+div[1][1]*div[2][1])/(div[2][0]*div[2][0]+div[2][1]*div[2][1]),0,
						(div[1][1]*div[2][0]-div[1][0]*div[2][1])/(div[2][0]*div[2][0]+div[2][1]*div[2][1]),0
					]
				]
			}else*/
			this.quas[target]=[[NaN,NaN,NaN,NaN],[NaN,NaN,NaN,NaN]];
			this.quas[control]=[[NaN,NaN,NaN,NaN],[NaN,NaN,NaN,NaN]];
			return this;
		},
		id:function(){
			return this;
		}
	}
})()
quaBuilder.prototype.constructor=quaBuilder;
