const actions = {
  "bold": bold,
  "italic": italic,
  "underline": underline,
  "strike": strike
}

export function copyWithId(id) {
  return navigator.clipboard.writeText(id)
}

export function copy(editor) {
  const contents = editor.getContents()
  const text = contents.map(op => {
    const attr = op.attributes
    const keys = Object.keys(attr || {})
    const key = keys[0]
    return key ? actions[key](op.insert) : op.insert
  }).join("").replaceAll("\n", "\u{2800}\n")
  return navigator.clipboard.writeText(text)
}

function bold(text) {
  return applyCharMap(boldSansCharMap, text)
}

function italic(text) {
  return applyCharMap(italicCharMap, text)
}

function underline(text) {
  return text.split("").join("̲") + "̲";
}

function strike(text) {
  return text.split("").join("̶") + "̶";
}

var boldCharMap = {
  "0": "𝟎",
  "1": "𝟏",
  "2": "𝟐",
  "3": "𝟑",
  "4": "𝟒",
  "5": "𝟓",
  "6": "𝟔",
  "7": "𝟕",
  "8": "𝟖",
  "9": "𝟗",
  "a": "𝐚",
  "b": "𝐛",
  "c": "𝐜",
  "d": "𝐝",
  "e": "𝐞",
  "f": "𝐟",
  "g": "𝐠",
  "h": "𝐡",
  "i": "𝐢",
  "j": "𝐣",
  "k": "𝐤",
  "l": "𝐥",
  "m": "𝐦",
  "n": "𝐧",
  "o": "𝐨",
  "p": "𝐩",
  "q": "𝐪",
  "r": "𝐫",
  "s": "𝐬",
  "t": "𝐭",
  "u": "𝐮",
  "v": "𝐯",
  "w": "𝐰",
  "x": "𝐱",
  "y": "𝐲",
  "z": "𝐳",
  "A": "𝐀",
  "B": "𝐁",
  "C": "𝐂",
  "D": "𝐃",
  "E": "𝐄",
  "F": "𝐅",
  "G": "𝐆",
  "H": "𝐇",
  "I": "𝐈",
  "J": "𝐉",
  "K": "𝐊",
  "L": "𝐋",
  "M": "𝐌",
  "N": "𝐍",
  "O": "𝐎",
  "P": "𝐏",
  "Q": "𝐐",
  "R": "𝐑",
  "S": "𝐒",
  "T": "𝐓",
  "U": "𝐔",
  "V": "𝐕",
  "W": "𝐖",
  "X": "𝐗",
  "Y": "𝐘",
  "Z": "𝐙"
};

var boldSansCharMap = {
  "0": "𝟬",
  "1": "𝟭",
  "2": "𝟮",
  "3": "𝟯",
  "4": "𝟰",
  "5": "𝟱",
  "6": "𝟲",
  "7": "𝟳",
  "8": "𝟴",
  "9": "𝟵",
  "a": "𝗮",
  "b": "𝗯",
  "c": "𝗰",
  "d": "𝗱",
  "e": "𝗲",
  "f": "𝗳",
  "g": "𝗴",
  "h": "𝗵",
  "i": "𝗶",
  "j": "𝗷",
  "k": "𝗸",
  "l": "𝗹",
  "m": "𝗺",
  "n": "𝗻",
  "o": "𝗼",
  "p": "𝗽",
  "q": "𝗾",
  "r": "𝗿",
  "s": "𝘀",
  "t": "𝘁",
  "u": "𝘂",
  "v": "𝘃",
  "w": "𝘄",
  "x": "𝘅",
  "y": "𝘆",
  "z": "𝘇",
  "A": "𝗔",
  "B": "𝗕",
  "C": "𝗖",
  "D": "𝗗",
  "E": "𝗘",
  "F": "𝗙",
  "G": "𝗚",
  "H": "𝗛",
  "I": "𝗜",
  "J": "𝗝",
  "K": "𝗞",
  "L": "𝗟",
  "M": "𝗠",
  "N": "𝗡",
  "O": "𝗢",
  "P": "𝗣",
  "Q": "𝗤",
  "R": "𝗥",
  "S": "𝗦",
  "T": "𝗧",
  "U": "𝗨",
  "V": "𝗩",
  "W": "𝗪",
  "X": "𝗫",
  "Y": "𝗬",
  "Z": "𝗭"
};

var italicCharMap = {
  "0": "0",
  "1": "1",
  "2": "2",
  "3": "3",
  "4": "4",
  "5": "5",
  "6": "6",
  "7": "7",
  "8": "8",
  "9": "9",
  "a": "𝘢",
  "b": "𝘣",
  "c": "𝘤",
  "d": "𝘥",
  "e": "𝘦",
  "f": "𝘧",
  "g": "𝘨",
  "h": "𝘩",
  "i": "𝘪",
  "j": "𝘫",
  "k": "𝘬",
  "l": "𝘭",
  "m": "𝘮",
  "n": "𝘯",
  "o": "𝘰",
  "p": "𝘱",
  "q": "𝘲",
  "r": "𝘳",
  "s": "𝘴",
  "t": "𝘵",
  "u": "𝘶",
  "v": "𝘷",
  "w": "𝘸",
  "x": "𝘹",
  "y": "𝘺",
  "z": "𝘻",
  "A": "𝘈",
  "B": "𝘉",
  "C": "𝘊",
  "D": "𝘋",
  "E": "𝘌",
  "F": "𝘍",
  "G": "𝘎",
  "H": "𝘏",
  "I": "𝘐",
  "J": "𝘑",
  "K": "𝘒",
  "L": "𝘓",
  "M": "𝘔",
  "N": "𝘕",
  "O": "𝘖",
  "P": "𝘗",
  "Q": "𝘘",
  "R": "𝘙",
  "S": "𝘚",
  "T": "𝘛",
  "U": "𝘜",
  "V": "𝘝",
  "W": "𝘞",
  "X": "𝘟",
  "Y": "𝘠",
  "Z": "𝘡"
};

function transform(map, text) {
  return text.split("").map(char => {
    const result = map[char]
    return result || char
  }).join("")
}

function applyCharMap(map, text) {
  var out = "";
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = text.split("")[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var c = _step2.value;
      if (map[c] !== undefined) out += map[c]; else if (map[c.toLowerCase()] !== undefined) out += map[c.toLowerCase()]; else out += c;
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return out;
}



