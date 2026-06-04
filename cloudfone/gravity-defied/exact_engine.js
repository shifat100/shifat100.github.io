var FP = 0x10000;

function i32(value) {
  return value | 0;
}

function h(value) {
  return value | 0;
}

function fixedPx(value) {
  return Math.round(value * 8192);
}

// mul16: (a * b) >> 16 (BigInt ছাড়া বিশুদ্ধ JS 53-bit ইন্টিজার গুণন)
function mul16(a, b) {
  var sign = 1;
  if (a < 0) { a = -a; sign = -sign; }
  if (b < 0) { b = -b; sign = -sign; }
  
  var ah = (a >>> 16) & 0xffff;
  var al = a & 0xffff;
  var bh = (b >>> 16) & 0xffff;
  var bl = b & 0xffff;
  
  var term1 = ah * bh * 65536;
  var term2 = ah * bl + al * bh;
  var term3 = Math.floor((al * bl) / 65536);
  
  var result = term1 + term2 + term3;
  var signedResult = (result & 0xffffffff);
  if (sign < 0) {
    return -signedResult | 0;
  }
  return signedResult | 0;
}

// div16: (a * 65536) / b (53-bit রেঞ্জের নিরাপদ ভাগফল)
function div16(a, b) {
  if (b === 0) return a < 0 ? -0x7fffffff : 0x7fffffff;
  var result = (a * 65536) / b;
  var truncated = result < 0 ? Math.ceil(result) : Math.floor(result);
  return truncated | 0;
}

// divLongToIntShift: (value / den) >> 16
function divLongToIntShift(value, den) {
  if (den === 0) return 0;
  var result = value / den;
  var shifted = result / 65536;
  var truncated = shifted < 0 ? Math.ceil(shifted) : Math.floor(shifted);
  return truncated | 0;
}

// SimpleMenuElement constructor
function SimpleMenuElement() {
  this.init();
}

SimpleMenuElement.prototype.init = function() {
  this.x = 0;
  this.y = 0;
  this.m_bI = 0;
  this.m_eI = 0;
  this.m_dI = 0;
  this.m_gotoI = 0;
  this.m_nullI = 0;
  this.m_longI = 0;
  this.m_fI = 0;
};

// K constructor
function K() {
  var arr = [];
  for (var i = 0; i < 6; i++) {
    arr.push(new SimpleMenuElement());
  }
  this.m_ifan = arr;
  this._avV();
}

K.prototype._avV = function() {
  this.m_aI = 0;
  this.m_forI = 0;
  this.m_newI = 0;
  this.m_doZ = true;
  this.m_intI = 0;
  for (var i = 0; i < this.m_ifan.length; i++) {
    this.m_ifan[i].init();
  }
};

// FPMath Helper Object
var FPMath = {
  HALF_PI: 0x19220,
  PI: 0x3243f,

  divide: function(i, j) {
    return div16(i, j);
  },

  sin: function(i) {
    return Math.round(Math.sin(i / 0xffff) * 65536) | 0;
  },

  _doII: function(i) {
    return FPMath.sin(FPMath.HALF_PI - i);
  },

  arctg: function(i) {
    return Math.round(Math.atan(i / 0xffff) * 65536) | 0;
  },

  _ifIII: function(i, j) {
    if (Math.abs(j) < 3) return (i <= 0 ? -1 : 1) * FPMath.HALF_PI;
    var k = FPMath.arctg(FPMath.divide(i, j));
    if (i > 0) return j > 0 ? k : FPMath.PI + k;
    return j > 0 ? k : k - FPMath.PI;
  }
};

// ExactLevel constructor
function ExactLevel(raw) {
  this.raw = raw;
  this.startX = fixedPx(raw.start.x);
  this.startY = fixedPx(raw.start.y);
  this.finishX = fixedPx(raw.finish.x);
  this.finishY = fixedPx(raw.finish.y);
  
  var pts = [];
  for (var i = 0; i < raw.points.length; i++) {
    pts.push([i32(raw.points[i].x << 13), i32(raw.points[i].y << 13)]);
  }
  this.points = pts;
  this.pointsCount = this.points.length;
  this.m_gotoI = 0;
  this.m_forI = 0;
  this.m_intI = 0;
  this.m_aI = 0;
  this.m_dI = 0;
  this.m_eI = 0;
  this.m_bI = 0;
  this.m_gI = 0;
  this.m_rI = 0;
}

ExactLevel.prototype._doII = function(j) {
  var k = j - this.points[this.m_gotoI][0];
  var i1 = this.points[this.m_forI][0] - this.points[this.m_gotoI][0];
  if (Math.abs(i1) < 3 || k > i1) return FP;
  return div16(k, i1);
};

ExactLevel.prototype._ifIIV = function(j, k) {
  this.m_aI = i32((j << 16) >> 3);
  this.m_dI = i32((k << 16) >> 3);
};

ExactLevel.prototype._aIIV = function(j, k, i1) {
  if (i1 === undefined) i1 = null;
  if (i1 === null) {
    this.m_eI = j >> 1;
    this.m_bI = k >> 1;
  } else {
    this.m_eI = j;
    this.m_bI = k;
    this.m_gI = i1;
  }
};

// ExactLoader constructor
function ExactLoader(rawLevel) {
  this.perspectiveEnabled = true;
  this.shadowsEnabled = true;
  this.m_haI = new Array(3);
  this.m_vaI = new Array(3);
  this.m_saaI = null;
  this.m_daI = 0;
  this.setRawLevel(rawLevel);
}

ExactLoader.prototype.setRawLevel = function(rawLevel) {
  this.levels = new ExactLevel(rawLevel);
  this.m_nullI = rawLevel.leagueId !== undefined ? rawLevel.leagueId : 0;
  this.m_fI = rawLevel.trackId !== undefined ? rawLevel.trackId : 0;
  this.m_eaI = 0;
  this.m_faI = 0;
  this.m_aI = 0;
  this.m_kI = 0;
  this.m_longI = 0;
  this.m_eI = 0;
  this.m_dI = 0;
  for (var j = 0; j < 3; j += 1) {
    this.m_haI[j] = mul16((Physics.m_foraI[j] + 19660) >> 1, (Physics.m_foraI[j] + 19660) >> 1);
    this.m_vaI[j] = mul16((Physics.m_foraI[j] - 19660) >> 1, (Physics.m_foraI[j] - 19660) >> 1);
  }
  this.load(this.levels);
};

ExactLoader.prototype._ifIV = function() {
  this.m_jI = this.levels.startX << 1;
  this.m_iI = this.levels.startY << 1;
};

ExactLoader.prototype._dovI = function() {
  return this.levels.points[this.levels.m_forI][0] << 1;
};

ExactLoader.prototype._intvI = function() {
  return this.levels.points[this.levels.m_gotoI][0] << 1;
};

ExactLoader.prototype._newvI = function() {
  return this.levels.startX << 1;
};

ExactLoader.prototype._avI = function() {
  return this.levels.startY << 1;
};

ExactLoader.prototype._aII = function(j) {
  return this.levels._doII(j >> 1);
};

ExactLoader.prototype.load = function(level) {
  this.m_longI = -2147483648;
  this.levels = level;
  var count = level.pointsCount;
  if (this.m_saaI === null || this.m_daI < count) {
    this.m_daI = count >= 100 ? count : 100;
    var arr = [];
    for (var idx = 0; idx < this.m_daI; idx++) {
      arr.push([0, 0]);
    }
    this.m_saaI = arr;
  }
  this.m_eaI = 0;
  this.m_faI = 0;
  this.m_aI = level.points[this.m_eaI][0];
  this.m_kI = level.points[this.m_faI][0];
  level.m_gotoI = 0;
  level.m_forI = 0;
  for (var k = 0; k < count; k += 1) {
    var next = (k + 1) % count;
    var i1 = i32(level.points[next][0] - level.points[k][0]);
    var j1 = i32(level.points[next][1] - level.points[k][1]);
    if (k !== 0 && k !== count - 1) this.m_longI = Math.max(this.m_longI, level.points[k][0]);
    var k1 = -j1;
    var i2 = i1;
    var j2 = Physics._doIII(k1, i2);
    this.m_saaI[k][0] = div16(k1, j2);
    this.m_saaI[k][1] = div16(i2, j2);
    if (level.m_gotoI === 0 && level.points[k][0] > level.startX) level.m_gotoI = k + 1;
    if (level.m_forI === 0 && level.points[k][0] > level.finishX) level.m_forI = k;
  }
  this.m_eaI = 0;
  this.m_faI = 0;
  this.m_aI = 0;
  this.m_kI = 0;
};

ExactLoader.prototype._ifIIV = function(j, k) {
  this.levels._ifIIV(j, k);
};

ExactLoader.prototype._aIIV = function(j, k, i1) {
  this.levels._aIIV((j + 0x18000) >> 1, (k - 0x18000) >> 1, i1 >> 1);
  k >>= 1;
  j >>= 1;
  this.m_faI = Math.min(this.m_faI, this.levels.pointsCount - 1);
  this.m_eaI = Math.max(this.m_eaI, 0);
  if (k > this.m_kI) {
    while (this.m_faI < this.levels.pointsCount - 1 && k > this.levels.points[++this.m_faI][0]);
  } else if (j < this.m_aI) {
    while (this.m_eaI > 0 && j < this.levels.points[--this.m_eaI][0]);
  } else {
    while (this.m_eaI < this.levels.pointsCount && j > this.levels.points[++this.m_eaI][0]);
    if (this.m_eaI > 0) this.m_eaI -= 1;
    while (this.m_faI > 0 && k < this.levels.points[--this.m_faI][0]);
    this.m_faI = this.m_faI + 1 >= this.levels.pointsCount - 1 ? this.levels.pointsCount - 1 : this.m_faI + 1;
  }
  this.m_aI = this.levels.points[this.m_eaI][0];
  this.m_kI = this.levels.points[this.m_faI][0];
};

ExactLoader.prototype._anvI = function(n1, j) {
  var k3 = 0;
  var byte1 = 2;
  var l3 = n1.x >> 1;
  var i4 = n1.y >> 1;
  if (this.perspectiveEnabled) i4 -= FP;
  var j4 = 0;
  var k4 = 0;
  for (var l4 = this.m_eaI; l4 < this.m_faI; l4 += 1) {
    var k = this.levels.points[l4][0];
    var i1 = this.levels.points[l4][1];
    var j1 = this.levels.points[l4 + 1][0];
    var k1 = this.levels.points[l4 + 1][1];
    if (l3 - this.m_haI[j] > j1 || l3 + this.m_haI[j] < k) continue;
    var l1 = i32(k - j1);
    var i2 = i32(i1 - k1);
    var j2 = i32(mul16(l1, l1) + mul16(i2, i2));
    var k2 = i32(mul16(l3 - k, -l1) + mul16(i4 - i1, -i2));
    var l2;
    if (Math.abs(j2) >= 3) l2 = div16(k2, j2);
    else l2 = (k2 <= 0 ? -1 : 1) * (j2 <= 0 ? -1 : 1) * 0x7fffffff;
    if (l2 < 0) l2 = 0;
    if (l2 > FP) l2 = FP;
    var i3 = i32(k + mul16(l2, -l1));
    var j3 = i32(i1 + mul16(l2, -i2));
    var dx = l3 - i3;
    var dy = i4 - j3;
    var l5 = mul16(dx, dx) + mul16(dy, dy); // BigInt বাদ দিয়ে স্ট্যান্ডার্ড যোগ
    var byte0;
    if (l5 < this.m_haI[j]) byte0 = l5 >= this.m_vaI[j] ? 1 : 0; // BigInt টাইপ কাস্টিং রিমুভড
    else byte0 = 2;
    var dot = i32(mul16(this.m_saaI[l4][0], n1.m_eI) + mul16(this.m_saaI[l4][1], n1.m_dI));
    if (byte0 === 0 && dot < 0) {
      this.m_eI = this.m_saaI[l4][0];
      this.m_dI = this.m_saaI[l4][1];
      return 0;
    }
    if (byte0 !== 1 || dot >= 0) continue;
    k3 += 1;
    byte1 = 1;
    if (k3 === 1) {
      j4 = this.m_saaI[l4][0];
      k4 = this.m_saaI[l4][1];
    } else {
      j4 = i32(j4 + this.m_saaI[l4][0]);
      k4 = i32(k4 + this.m_saaI[l4][1]);
    }
  }
  if (byte1 === 1) {
    if (i32(mul16(j4, n1.m_eI) + mul16(k4, n1.m_dI)) >= 0) return 2;
    this.m_eI = j4;
    this.m_dI = k4;
  }
  return byte1;
};

// Physics constructor
function Physics(loader) {
  this.m_vaI = 0;
  this.m_waI = 1;
  this.m_xaI = -1;
  this.m_cI = 0;
  this.m_EI = 0;
  this.m_CI = 0;
  this.m_IZ = false;
  this.m_mZ = false;
  this.m_TI = 32768;
  this.m_kI = 0;
  this.m_vZ = false;
  this.m_bZ = false;
  this.m_afZ = false;
  
  var arr = [];
  for (var i = 0; i < 6; i++) {
    arr.push(new SimpleMenuElement());
  }
  this.m_aaan = arr;
  
  this.m_tI = 0;
  this.m_zI = 0;
  this.m_elseZ = false;
  this.m_UZ = false;
  this.m_dZ = false;
  this.m_FZ = false;
  this.m_XZ = false;
  this.m_wZ = false;
  this.m_ifZ = false;
  this.m_sZ = false;
  this.m_OZ = false;
  this.m_rZ = false;
  this.m_RZ = false;
  this.m_NZ = false;
  this.m_doZ = true;
  this.m_oI = 0;
  this.m_nI = 0;
  this.m_GI = 0xa0000;
  this.m_lf = loader;
  this.m_Hak = null;
  this.m_ian = null;
  this._byteIV(1);
  this.m_vZ = false;
  this._charvV();
  this.m_IZ = false;
}

Physics.m_foraI = [0x1c000, 0x10000, 32768];

Physics._doIII = function(j, i1) {
  var j1 = Math.abs(j);
  var k1 = Math.abs(i1);
  var l1 = k1 >= j1 ? k1 : j1;
  var i2 = k1 >= j1 ? j1 : k1;
  return i32(mul16(64448, l1) + mul16(28224, i2));
};

Physics.prototype.setLeague = function(j) {
  Physics.m_hI = j;
  Physics.m_gI = 45875;
  Physics.m_fI = 13107;
  Physics.m_eI = 39321;
  Physics.m_yI = 0x140000;
  Physics.m_xI = 0x40000;
  Physics.m_jI = 6553;
  switch (j) {
    case 3:
      Physics.m_aeI = 32768; Physics.m_adI = 32768; Physics.m_PI = 0x160000; Physics.m_QI = 0x4b00000;
      Physics.m_charI = 0x360000; Physics.m_abI = 6553; Physics.m_WI = 26214; Physics.m_AI = FP;
      Physics.m_longI = 0x140000; Physics.m_qI = 0x14a0000; break;
    case 2:
      Physics.m_aeI = 32768; Physics.m_adI = 32768; Physics.m_PI = 0x140000; Physics.m_QI = 0x47e0000;
      Physics.m_charI = 0x350000; Physics.m_abI = 6553; Physics.m_WI = 26214; Physics.m_AI = 39321;
      Physics.m_longI = 0x50000; Physics.m_qI = 0x14a0000; break;
    case 1:
      Physics.m_aeI = 32768; Physics.m_adI = 32768; Physics.m_PI = 0x110000; Physics.m_QI = 0x3e80000;
      Physics.m_charI = 0x320000; Physics.m_abI = 6553; Physics.m_WI = 26214; Physics.m_AI = 26214;
      Physics.m_longI = 0x50000; Physics.m_qI = 0x12c0000; break;
    case 0:
    default:
      Physics.m_aeI = 19660; Physics.m_adI = 19660; Physics.m_PI = 0x110000; Physics.m_QI = 0x3200000;
      Physics.m_charI = 0x320000; Physics.m_abI = 327; Physics.m_WI = 0; Physics.m_AI = 32768;
      Physics.m_longI = 0x50000; Physics.m_qI = 0x12c0000; break;
  }
  this._doZV(true);
};

Physics.prototype._byteIV = function(j) {
  this.m_zI = j;
  Physics.m_YI = 1310;
  Physics.m_voidI = 0x190000;
  this.setLeague(1);
  this._doZV(true);
};

Physics.prototype._doIV = function(j) {
  this.m_elseZ = false;
  this.m_UZ = false;
  if ((j & 2) !== 0) this.m_elseZ = true;
  if ((j & 1) !== 0) this.m_UZ = true;
};

Physics.prototype._doZV = function() {
  this.m_tI = 0;
  this._iIIV(this.m_lf._newvI(), this.m_lf._avI());
  this.m_cI = 0;
  this.m_kI = 0;
  this.m_IZ = false;
  this.m_mZ = false;
  this.m_RZ = false;
  this.m_NZ = false;
  this.m_vZ = false;
  this.m_bZ = false;
  this.m_afZ = false;
  this.m_lf.levels._aIIV((this.m_Hak[2].m_ifan[5].x + 0x18000) - Physics.m_foraI[0], (this.m_Hak[1].m_ifan[5].x - 0x18000) + Physics.m_foraI[0]);
};

Physics.prototype._iIIV = function(j, i1) {
  if (this.m_Hak === null) this.m_Hak = new Array(6);
  if (this.m_ian === null) this.m_ian = new Array(10);
  var l1 = 0, i2 = 0, j2 = 0, k2 = 0;
  for (var j1 = 0; j1 < 6; j1 += 1) {
    var l2 = 0;
    switch (j1) {
      case 0: i2 = 1; l1 = 0x58000; j2 = 0; k2 = 0; break;
      case 4: i2 = 1; l1 = 0x38000; j2 = h(0xfffe0000); k2 = 0x30000; break;
      case 3: i2 = 1; l1 = 0x38000; j2 = 0x20000; k2 = 0x30000; break;
      case 1: i2 = 0; l1 = 0x18000; j2 = 0x38000; k2 = 0; break;
      case 2: i2 = 0; l1 = 0x58000; j2 = h(0xfffc8000); k2 = 0; l2 = 21626; break;
      case 5: i2 = 2; l1 = 0x48000; j2 = 0; k2 = 0x50000; break;
    }
    if (!this.m_Hak[j1]) this.m_Hak[j1] = new K();
    this.m_Hak[j1]._avV();
    this.m_Hak[j1].m_aI = Physics.m_foraI[i2];
    this.m_Hak[j1].m_intI = i2;
    this.m_Hak[j1].m_forI = mul16(divLongToIntShift(0x1000000000000, l1), Physics.m_yI); // 0x1000000000000n কে 0x1000000000000 এ পরিবর্তন
    this.m_Hak[j1].m_ifan[this.m_vaI].x = i32(j + j2);
    this.m_Hak[j1].m_ifan[this.m_vaI].y = i32(i1 + k2);
    this.m_Hak[j1].m_ifan[5].x = i32(j + j2);
    this.m_Hak[j1].m_ifan[5].y = i32(i1 + k2);
    this.m_Hak[j1].m_newI = l2;
  }
  for (var k1 = 0; k1 < 10; k1 += 1) {
    if (!this.m_ian[k1]) this.m_ian[k1] = new SimpleMenuElement();
    this.m_ian[k1].init();
    this.m_ian[k1].x = Physics.m_qI;
    this.m_ian[k1].m_bI = Physics.m_xI;
  }
  this.m_ian[0].y = 0x38000; this.m_ian[1].y = 0x38000; this.m_ian[2].y = 0x39b05; this.m_ian[3].y = 0x39b05;
  this.m_ian[4].y = 0x40000; this.m_ian[5].y = 0x35aa6; this.m_ian[6].y = 0x35aa6; this.m_ian[7].y = 0x2d413;
  this.m_ian[8].y = 0x2d413; this.m_ian[9].y = 0x50000;
  this.m_ian[5].m_bI = mul16(Physics.m_xI, 45875);
  this.m_ian[6].x = mul16(6553, Physics.m_qI);
  this.m_ian[5].x = mul16(6553, Physics.m_qI);
  this.m_ian[9].x = mul16(0x11999, Physics.m_qI);
  this.m_ian[8].x = mul16(0x11999, Physics.m_qI);
  this.m_ian[7].x = mul16(0x11999, Physics.m_qI);
};

Physics.prototype._ifIIV = function(j, i1) {
  this.m_lf._ifIIV(j, i1);
};

Physics.prototype._nullvV = function() {
  this.m_ifZ = this.m_sZ = this.m_rZ = this.m_OZ = false;
};

Physics.prototype._aIIV = function(j, i1) {
  if (!this.m_vZ) {
    this.m_ifZ = this.m_sZ = this.m_rZ = this.m_OZ = false;
    if (j > 0) this.m_ifZ = true;
    else if (j < 0) this.m_sZ = true;
    if (i1 > 0) this.m_rZ = true;
    else if (i1 < 0) this.m_OZ = true;
  }
};

Physics.prototype._casevV = function() {
  this._doZV(true);
  this.m_vZ = true;
};

Physics.prototype._avV = function() {
  this.m_vZ = false;
};

Physics.prototype._pvV = function() {
  var j = this.m_Hak[1].m_ifan[this.m_vaI].x - this.m_Hak[2].m_ifan[this.m_vaI].x;
  var i1 = this.m_Hak[1].m_ifan[this.m_vaI].y - this.m_Hak[2].m_ifan[this.m_vaI].y;
  var j1 = Physics._doIII(j, i1);
  i1 = div16(i1, j1);
  this.m_FZ = false;
  if (i1 < 0) { this.m_XZ = true; this.m_wZ = false; }
  else if (i1 > 0) { this.m_wZ = true; this.m_XZ = false; }
  var flag = (this.m_Hak[2].m_ifan[this.m_vaI].y - this.m_Hak[0].m_ifan[this.m_vaI].y <= 0 ? -1 : 1) *
    (this.m_Hak[2].m_ifan[this.m_vaI].m_eI - this.m_Hak[0].m_ifan[this.m_vaI].m_eI <= 0 ? -1 : 1) > 0;
  this.m_dZ = (flag && this.m_wZ) || (!flag && this.m_XZ);
};

Physics.prototype._qvV = function() {
  if (this.m_IZ) return;
  var j = this.m_Hak[1].m_ifan[this.m_vaI].x - this.m_Hak[2].m_ifan[this.m_vaI].x;
  var i1 = this.m_Hak[1].m_ifan[this.m_vaI].y - this.m_Hak[2].m_ifan[this.m_vaI].y;
  var j1 = Physics._doIII(j, i1);
  j = div16(j, j1);
  i1 = div16(i1, j1);
  if (this.m_dZ && this.m_cI >= -Physics.m_QI) this.m_cI -= Physics.m_charI;
  if (this.m_FZ) {
    this.m_cI = 0;
    var indices = [1, 2];
    for (var idx = 0; idx < indices.length; idx++) {
      var n = this.m_Hak[indices[idx]].m_ifan[this.m_vaI];
      n.m_gotoI = mul16(n.m_gotoI, FP - Physics.m_abI);
      if (n.m_gotoI < 6553) n.m_gotoI = 0;
    }
  }
  this.m_Hak[0].m_forI = mul16(11915, Physics.m_yI);
  this.m_Hak[4].m_forI = mul16(18724, Physics.m_yI);
  this.m_Hak[3].m_forI = mul16(18724, Physics.m_yI);
  this.m_Hak[1].m_forI = mul16(43690, Physics.m_yI);
  this.m_Hak[2].m_forI = mul16(11915, Physics.m_yI);
  this.m_Hak[5].m_forI = mul16(14563, Physics.m_yI);
  if (this.m_XZ) {
    this.m_Hak[0].m_forI = mul16(18724, Physics.m_yI);
    this.m_Hak[4].m_forI = mul16(14563, Physics.m_yI);
    this.m_Hak[3].m_forI = mul16(18724, Physics.m_yI);
    this.m_Hak[1].m_forI = mul16(43690, Physics.m_yI);
    this.m_Hak[2].m_forI = mul16(10082, Physics.m_yI);
  } else if (this.m_wZ) {
    this.m_Hak[0].m_forI = mul16(18724, Physics.m_yI);
    this.m_Hak[4].m_forI = mul16(18724, Physics.m_yI);
    this.m_Hak[3].m_forI = mul16(14563, Physics.m_yI);
    this.m_Hak[1].m_forI = mul16(26214, Physics.m_yI);
    this.m_Hak[2].m_forI = mul16(11915, Physics.m_yI);
  }
  if (this.m_XZ || this.m_wZ) {
    var k1 = -i1;
    var l1 = j;
    if (this.m_XZ && this.m_kI > -Physics.m_longI) {
      var i2 = FP;
      if (this.m_kI < 0) i2 = div16(Physics.m_longI - Math.abs(this.m_kI), Physics.m_longI);
      var k2 = mul16(Physics.m_AI, i2);
      this.m_TI = this.m_TI > 32768 ? Math.max(0, this.m_TI - 1638) : Math.max(0, this.m_TI - 3276);
      this.m_Hak[4].m_ifan[this.m_vaI].m_eI -= mul16(k1, k2);
      this.m_Hak[4].m_ifan[this.m_vaI].m_dI -= mul16(l1, k2);
      this.m_Hak[3].m_ifan[this.m_vaI].m_eI += mul16(k1, k2);
      this.m_Hak[3].m_ifan[this.m_vaI].m_dI += mul16(l1, k2);
      this.m_Hak[5].m_ifan[this.m_vaI].m_eI -= mul16(j, k2);
      this.m_Hak[5].m_ifan[this.m_vaI].m_dI -= mul16(i1, k2);
    }
    if (this.m_wZ && this.m_kI < Physics.m_longI) {
      var j2 = FP;
      if (this.m_kI > 0) j2 = div16(Physics.m_longI - this.m_kI, Physics.m_longI);
      var l2 = mul16(Physics.m_AI, j2);
      this.m_TI = this.m_TI > 32768 ? Math.min(FP, this.m_TI + 1638) : Math.min(FP, this.m_TI + 3276);
      this.m_Hak[4].m_ifan[this.m_vaI].m_eI += mul16(k1, l2);
      this.m_Hak[4].m_ifan[this.m_vaI].m_dI += mul16(l1, l2);
      this.m_Hak[3].m_ifan[this.m_vaI].m_eI -= mul16(k1, l2);
      this.m_Hak[3].m_ifan[this.m_vaI].m_dI -= mul16(l1, l2);
      this.m_Hak[5].m_ifan[this.m_vaI].m_eI += mul16(j, l2);
      this.m_Hak[5].m_ifan[this.m_vaI].m_dI += mul16(i1, l2);
    }
    return;
  }
  if (this.m_TI < 26214) this.m_TI += 3276;
  else if (this.m_TI > 39321) this.m_TI -= 3276;
  else this.m_TI = 32768;
};

Physics.prototype._dovI = function() {
  this.m_dZ = this.m_ifZ;
  this.m_FZ = this.m_sZ;
  this.m_XZ = this.m_OZ;
  this.m_wZ = this.m_rZ;
  if (this.m_vZ) this._pvV();
  this._qvV();
  var j = this._uII(Physics.m_YI);
  if (j === 5 || this.m_mZ) return 5;
  if (this.m_IZ) return 3;
  if (this._newvZ()) {
    this.m_NZ = false;
    return 4;
  }
  return j;
};

Physics.prototype._newvZ = function() {
  return this.m_Hak[1].m_ifan[this.m_vaI].x < this.m_lf._intvI();
};

Physics.prototype._longvZ = function() {
  return this.m_Hak[1].m_ifan[this.m_waI].x > this.m_lf._dovI() || this.m_Hak[2].m_ifan[this.m_waI].x > this.m_lf._dovI();
};

Physics.prototype._uII = function(j) {
  var flag = this.m_RZ;
  var i1 = 0;
  var j1 = j;
  while (i1 < j) {
    this._aaIV(j1 - i1);
    var k1 = (!flag && this._longvZ()) ? 3 : this._baII(this.m_waI);
    if (!flag && this.m_RZ) return k1 === 3 ? 1 : 2;
    if (k1 === 0) {
      j1 = (i1 + j1) >> 1;
      if (Math.abs(j1 - i1) < 65) return 5;
    } else if (k1 === 3) {
      this.m_RZ = true;
      j1 = (i1 + j1) >> 1;
    } else {
      if (k1 === 1) {
        var i2;
        do {
          this._caIV(this.m_waI);
          var j2 = this._baII(this.m_waI);
          i2 = j2;
          if (j2 === 0) return 5;
        } while (i2 !== 2);
      }
      i1 = j1;
      j1 = j;
      this.m_vaI = this.m_vaI !== 1 ? 1 : 0;
      this.m_waI = this.m_waI !== 1 ? 1 : 0;
    }
  }
  var l1 = i32(mul16(this.m_Hak[1].m_ifan[this.m_vaI].x - this.m_Hak[2].m_ifan[this.m_vaI].x, this.m_Hak[1].m_ifan[this.m_vaI].x - this.m_Hak[2].m_ifan[this.m_vaI].x) +
    mul16(this.m_Hak[1].m_ifan[this.m_vaI].y - this.m_Hak[2].m_ifan[this.m_vaI].y, this.m_Hak[1].m_ifan[this.m_vaI].y - this.m_Hak[2].m_ifan[this.m_vaI].y));
  if (l1 < 0xf0000 || l1 > 0x460000) this.m_IZ = true;
  return 0;
};

Physics.prototype._aIV = function(j) {
  for (var i1 = 0; i1 < 6; i1 += 1) {
    var k1 = this.m_Hak[i1];
    var n1 = k1.m_ifan[j];
    n1.m_nullI = 0;
    n1.m_longI = 0;
    n1.m_fI = 0;
    n1.m_longI -= div16(Physics.m_voidI, k1.m_forI);
  }
  if (!this.m_IZ) {
    this._akkV(this.m_Hak[0], this.m_ian[1], this.m_Hak[2], j, FP);
    this._akkV(this.m_Hak[0], this.m_ian[0], this.m_Hak[1], j, FP);
    this._akkV(this.m_Hak[2], this.m_ian[6], this.m_Hak[4], j, 0x20000);
    this._akkV(this.m_Hak[1], this.m_ian[5], this.m_Hak[3], j, 0x20000);
  }
  this._akkV(this.m_Hak[0], this.m_ian[2], this.m_Hak[3], j, FP);
  this._akkV(this.m_Hak[0], this.m_ian[3], this.m_Hak[4], j, FP);
  this._akkV(this.m_Hak[3], this.m_ian[4], this.m_Hak[4], j, FP);
  this._akkV(this.m_Hak[5], this.m_ian[8], this.m_Hak[3], j, FP);
  this._akkV(this.m_Hak[5], this.m_ian[7], this.m_Hak[4], j, FP);
  this._akkV(this.m_Hak[5], this.m_ian[9], this.m_Hak[0], j, FP);
  var n2 = this.m_Hak[2].m_ifan[j];
  this.m_cI = mul16(this.m_cI, FP - Physics.m_jI);
  n2.m_fI = this.m_cI;
  if (n2.m_gotoI > Physics.m_PI) n2.m_gotoI = Physics.m_PI;
  if (n2.m_gotoI < -Physics.m_PI) n2.m_gotoI = -Physics.m_PI;
  var sx = 0, sy = 0;
  for (var i2 = 0; i2 < 6; i2 += 1) {
    sx += this.m_Hak[i2].m_ifan[j].m_eI;
    sy += this.m_Hak[i2].m_ifan[j].m_dI;
  }
  sx = div16(sx, 0x60000);
  sy = div16(sy, 0x60000);
  var j3 = 0;
  for (var k3 = 0; k3 < 6; k3 += 1) {
    var j2 = this.m_Hak[k3].m_ifan[j].m_eI - sx;
    var k2 = this.m_Hak[k3].m_ifan[j].m_dI - sy;
    j3 = Physics._doIII(j2, k2);
    if (j3 > 0x1e0000) {
      this.m_Hak[k3].m_ifan[j].m_eI -= div16(j2, j3);
      this.m_Hak[k3].m_ifan[j].m_dI -= div16(k2, j3);
    }
  }
  var byte0 = this.m_Hak[2].m_ifan[j].y - this.m_Hak[0].m_ifan[j].y < 0 ? -1 : 1;
  var byte1 = this.m_Hak[2].m_ifan[j].m_eI - this.m_Hak[0].m_ifan[j].m_eI < 0 ? -1 : 1;
  this.m_kI = byte0 * byte1 > 0 ? j3 : -j3;
};

Physics.prototype._akkV = function(k1, n1, k2, j, i1) {
  var n2 = k1.m_ifan[j];
  var n3 = k2.m_ifan[j];
  var j1 = n2.x - n3.x;
  var l1 = n2.y - n3.y;
  var i2 = Physics._doIII(j1, l1);
  if (Math.abs(i2) < 3) return;
  j1 = div16(j1, i2);
  l1 = div16(l1, i2);
  var j2 = i2 - n1.y;
  var l2 = mul16(j1, mul16(j2, n1.x));
  var i3 = mul16(l1, mul16(j2, n1.x));
  var j3 = n2.m_eI - n3.m_eI;
  var k3 = n2.m_dI - n3.m_dI;
  var l3 = mul16(i32(mul16(j1, j3) + mul16(l1, k3)), n1.m_bI);
  l2 += mul16(j1, l3);
  i3 += mul16(l1, l3);
  l2 = mul16(l2, i1);
  i3 = mul16(i3, i1);
  n2.m_nullI -= l2;
  n2.m_longI -= i3;
  n3.m_nullI += l2;
  n3.m_longI += i3;
};

Physics.prototype._aIIV3 = function(j, i1, j1) {
  for (var l1 = 0; l1 < 6; l1 += 1) {
    var n1 = this.m_Hak[l1].m_ifan[j];
    var n2 = this.m_Hak[l1].m_ifan[i1];
    n2.x = mul16(n1.m_eI, j1);
    n2.y = mul16(n1.m_dI, j1);
    var k1 = mul16(j1, this.m_Hak[l1].m_forI);
    n2.m_eI = mul16(n1.m_nullI, k1);
    n2.m_dI = mul16(n1.m_longI, k1);
  }
};

Physics.prototype._zIIV = function(j, i1, j1) {
  for (var k1 = 0; k1 < 6; k1 += 1) {
    var n1 = this.m_Hak[k1].m_ifan[j];
    var n2 = this.m_Hak[k1].m_ifan[i1];
    var n3 = this.m_Hak[k1].m_ifan[j1];
    n1.x = n2.x + (n3.x >> 1);
    n1.y = n2.y + (n3.y >> 1);
    n1.m_eI = n2.m_eI + (n3.m_eI >> 1);
    n1.m_dI = n2.m_dI + (n3.m_dI >> 1);
  }
};

Physics.prototype._aaIV = function(j) {
  this._aIV(this.m_vaI);
  this._aIIV3(this.m_vaI, 2, j);
  this._zIIV(4, this.m_vaI, 2);
  this._aIV(4);
  this._aIIV3(4, 3, j >> 1);
  this._zIIV(4, this.m_vaI, 3);
  this._zIIV(this.m_waI, this.m_vaI, 2);
  this._zIIV(this.m_waI, this.m_waI, 3);
  for (var i1 = 1; i1 <= 2; i1 += 1) {
    var n1 = this.m_Hak[i1].m_ifan[this.m_vaI];
    var n2 = this.m_Hak[i1].m_ifan[this.m_waI];
    n2.m_bI = n1.m_bI + mul16(j, n1.m_gotoI);
    n2.m_gotoI = n1.m_gotoI + mul16(j, mul16(this.m_Hak[i1].m_newI, n1.m_fI));
  }
};

Physics.prototype._baII = function(j) {
  var byte0 = 2;
  var maxX = Math.max(this.m_Hak[1].m_ifan[j].x, this.m_Hak[2].m_ifan[j].x, this.m_Hak[5].m_ifan[j].x);
  var minX = Math.min(this.m_Hak[1].m_ifan[j].x, this.m_Hak[2].m_ifan[j].x, this.m_Hak[5].m_ifan[j].x);
  this.m_lf._aIIV(minX - Physics.m_foraI[0], maxX + Physics.m_foraI[0], this.m_Hak[5].m_ifan[j].y);
  var k1 = this.m_Hak[1].m_ifan[j].x - this.m_Hak[2].m_ifan[j].x;
  var l1 = this.m_Hak[1].m_ifan[j].y - this.m_Hak[2].m_ifan[j].y;
  var i2 = Physics._doIII(k1, l1);
  k1 = div16(k1, i2);
  var j2 = -div16(l1, i2);
  var k2 = k1;
  for (var l2 = 0; l2 < 6; l2 += 1) {
    if (l2 === 4 || l2 === 3) continue;
    var n1 = this.m_Hak[l2].m_ifan[j];
    if (l2 === 0) {
      n1.x += j2;
      n1.y += k2;
    }
    var i3 = this.m_lf._anvI(n1, this.m_Hak[l2].m_intI);
    if (l2 === 0) {
      n1.x -= j2;
      n1.y -= k2;
    }
    this.m_EI = this.m_lf.m_eI;
    this.m_CI = this.m_lf.m_dI;
    if (l2 === 5 && i3 !== 2) this.m_mZ = true;
    if (l2 === 1 && i3 !== 2) this.m_NZ = true;
    if (i3 === 1) {
      this.m_xaI = l2;
      byte0 = 1;
    } else if (i3 === 0) {
      this.m_xaI = l2;
      byte0 = 0;
      break;
    }
  }
  return byte0;
};

Physics.prototype._caIV = function(j) {
  var k1 = this.m_Hak[this.m_xaI];
  var n1 = k1.m_ifan[j];
  n1.x += mul16(this.m_EI, 3276);
  n1.y += mul16(this.m_CI, 3276);
  var i1, j1, l1, i2, j2;
  if (this.m_FZ && (this.m_xaI === 2 || this.m_xaI === 1) && n1.m_gotoI < 6553) {
    i1 = Physics.m_gI - Physics.m_WI; j1 = 13107; l1 = 39321; i2 = 26214 - Physics.m_WI; j2 = 26214 - Physics.m_WI;
  } else {
    i1 = Physics.m_gI; j1 = Physics.m_fI; l1 = Physics.m_eI; i2 = Physics.m_aeI; j2 = Physics.m_adI;
  }
  var k2 = Physics._doIII(this.m_EI, this.m_CI);
  this.m_EI = div16(this.m_EI, k2);
  this.m_CI = div16(this.m_CI, k2);
  var l2 = n1.m_eI;
  var i3 = n1.m_dI;
  var j3 = -(mul16(l2, this.m_EI) + mul16(i3, this.m_CI));
  var k3 = -(mul16(l2, -this.m_CI) + mul16(i3, this.m_EI));
  var l3 = mul16(i1, n1.m_gotoI) - mul16(j1, div16(k3, k1.m_aI));
  var i4 = mul16(i2, k3) - mul16(l1, mul16(n1.m_gotoI, k1.m_aI));
  var j4 = -mul16(j2, j3);
  n1.m_gotoI = l3;
  n1.m_eI = mul16(-i4, -this.m_CI) + mul16(-j4, this.m_EI);
  n1.m_dI = mul16(-i4, this.m_EI) + mul16(-j4, this.m_CI);
};

Physics.prototype._caseIV = function(j) {
  this.m_GI = div16(mul16(0xa0000, j << 16), 0x800000);
};

Physics.prototype._elsevI = function() {
  if (this.m_doZ) this.m_oI = div16(this.m_aaan[0].m_eI, 0x180000) + mul16(this.m_oI, 57344);
  else this.m_oI = 0;
  this.m_oI = Math.min(this.m_GI, Math.max(-this.m_GI, this.m_oI));
  return ((this.m_aaan[0].x + this.m_oI) << 2) >> 16;
};

Physics.prototype._ifvI = function() {
  if (this.m_doZ) this.m_nI = div16(this.m_aaan[0].m_dI, 0x180000) + mul16(this.m_nI, 57344);
  else this.m_nI = 0;
  this.m_nI = Math.min(this.m_GI, Math.max(-this.m_GI, this.m_nI));
  return ((this.m_aaan[0].y + this.m_nI) << 2) >> 16;
};

Physics.prototype._tryvI = function() {
  var j = Math.max(this.m_aaan[1].x, this.m_aaan[2].x);
  return this.m_IZ ? this.m_lf._aII(this.m_aaan[0].x) : this.m_lf._aII(j);
};

Physics.prototype._charvV = function() {
  for (var j = 0; j < 6; j += 1) {
    this.m_Hak[j].m_ifan[5].x = this.m_Hak[j].m_ifan[this.m_vaI].x;
    this.m_Hak[j].m_ifan[5].y = this.m_Hak[j].m_ifan[this.m_vaI].y;
    this.m_Hak[j].m_ifan[5].m_bI = this.m_Hak[j].m_ifan[this.m_vaI].m_bI;
  }
  this.m_Hak[0].m_ifan[5].m_eI = this.m_Hak[0].m_ifan[this.m_vaI].m_eI;
  this.m_Hak[0].m_ifan[5].m_dI = this.m_Hak[0].m_ifan[this.m_vaI].m_dI;
  this.m_Hak[2].m_ifan[5].m_gotoI = this.m_Hak[2].m_ifan[this.m_vaI].m_gotoI;
};

Physics.prototype._voidvV = function() {
  for (var j = 0; j < 6; j += 1) {
    this.m_aaan[j].x = this.m_Hak[j].m_ifan[5].x;
    this.m_aaan[j].y = this.m_Hak[j].m_ifan[5].y;
    this.m_aaan[j].m_bI = this.m_Hak[j].m_ifan[5].m_bI;
  }
  this.m_aaan[0].m_eI = this.m_Hak[0].m_ifan[5].m_eI;
  this.m_aaan[0].m_dI = this.m_Hak[0].m_ifan[5].m_dI;
  this.m_aaan[2].m_gotoI = this.m_Hak[2].m_ifan[5].m_gotoI;
};

Physics.prototype.getPoints = function() {
  var ptsMapped = [];
  for (var idx = 0; idx < this.m_aaan.length; idx++) {
    var point = this.m_aaan[idx];
    ptsMapped.push({
      x: (point.x << 2) / 0xffff,
      y: (point.y << 2) / 0xffff,
      wheel: point.m_bI
    });
  }
  return ptsMapped;
};

// গ্লোবাল অবজেক্ট হিসেবে এক্সপোজ করা হলো
window.FPMath = FPMath;
window.ExactLoader = ExactLoader;
window.Physics = Physics;