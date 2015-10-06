var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
// AvlTree implementation
var Reflex;
(function (Reflex) {
    ;
    function _null(node) {
        return null;
    }
    function _identity(value) {
        return value;
    }
    function _throwDuplicateKeyException(node, x) {
        throw new Error("Element with key '" + x + "' was already added into the tree");
    }
    function _setValue(node, x) {
        node.value = x;
    }
    function _replace(target, source) {
        var left = source.left;
        var right = source.right;
        target.balance = source.balance;
        target.key = source.key;
        target.value = source.value;
        target.left = left;
        target.right = right;
        if (left !== null) {
            left.parent = target;
        }
        if (right !== null) {
            right.parent = target;
        }
    }
    function _findNode(comparer, node, key, left, right, center) {
        if (node !== null) {
            while (true) {
                if (comparer(key, node.key) < 0) {
                    if (node.left) {
                        node = node.left;
                    }
                    else {
                        return left(node);
                    }
                }
                else if (comparer(key, node.key)) {
                    if (node.right) {
                        node = node.right;
                    }
                    else {
                        return right(node);
                    }
                }
                else {
                    return center(node);
                }
            }
        }
        return null;
    }
    function _step(curr, predecessor, successor) {
        if (curr !== null) {
            if (curr[successor] === null) {
                while (curr.parent !== null) {
                    var prev = curr;
                    curr = curr.parent;
                    if (curr[predecessor] === prev) {
                        return curr;
                    }
                }
            }
            else {
                curr = curr[successor];
                while (curr[predecessor] !== null) {
                    curr = curr[predecessor];
                }
                return curr;
            }
        }
        return null;
    }
    function _iterate(curr, predecessor, successor, fn) {
        if (curr !== null) {
            var down, next, stop = fn(curr);
            if (curr[successor] === null) {
                // up
                down = false;
            }
            else {
                // down
                down = true;
                next = curr[successor];
            }
            while (stop === void 0) {
                if (down) {
                    curr = next;
                    while (curr[predecessor] !== null)
                        curr = curr[predecessor];
                    next = curr[successor];
                    stop = fn(curr);
                    down = next !== null;
                }
                else if (curr.parent !== null) {
                    var prev = curr;
                    curr = curr.parent;
                    if (curr[predecessor] === prev) {
                        next = curr[successor];
                        stop = fn(curr);
                        down = next !== null;
                    }
                }
                else {
                    break;
                }
            }
            return stop;
        }
        return null;
    }
    function _insert(key, value, onDuplicate) {
        if (this.root === null) {
            var node = {
                balance: 0,
                key: key,
                value: value,
                left: null,
                right: null,
                parent: null
            };
            this.root = node;
            this.count = this.count + 1;
            return node;
        }
        else {
            var node = this.root;
            while (node !== null) {
                var comparison = this.comparer(key, node.key);
                if (comparison < 0) {
                    var left = node.left;
                    if (left !== null) {
                        node = left;
                    }
                    else {
                        var result = node.left = {
                            balance: 0,
                            key: key,
                            value: value,
                            left: null,
                            right: null,
                            parent: node
                        };
                        _rebalance.call(this, node, 1);
                        this.count = this.count + 1;
                        return result;
                    }
                }
                else if (comparison > 0) {
                    var right = node.right;
                    if (right !== null) {
                        node = right;
                    }
                    else {
                        var result = node.right = {
                            balance: 0,
                            key: key,
                            value: value,
                            left: null,
                            right: null,
                            parent: node
                        };
                        _rebalance.call(this, node, -1);
                        this.count = this.count + 1;
                        return result;
                    }
                }
                else {
                    onDuplicate(node, value);
                    return node;
                }
            }
        }
    }
    function _insertLazy(key, value, onDuplicate) {
        if (this.root === null) {
            var node = {
                balance: 0,
                key: key,
                value: value(),
                left: null,
                right: null,
                parent: null
            };
            this.root = node;
            this.count = this.count + 1;
            return node;
        }
        else {
            var node = this.root;
            while (node !== null) {
                var comparison = this.comparer(key, node.key);
                if (comparison < 0) {
                    var left = node.left;
                    if (left !== null) {
                        node = left;
                    }
                    else {
                        var result = node.left = {
                            balance: 0,
                            key: key,
                            value: value(),
                            left: null,
                            right: null,
                            parent: node
                        };
                        _rebalance.call(this, node, 1);
                        this.count = this.count + 1;
                        return result;
                    }
                }
                else if (comparison > 0) {
                    var right = node.right;
                    if (right !== null) {
                        node = right;
                    }
                    else {
                        var result = node.right = {
                            balance: 0,
                            key: key,
                            value: value(),
                            left: null,
                            right: null,
                            parent: node
                        };
                        _rebalance.call(this, node, -1);
                        this.count = this.count + 1;
                        return result;
                    }
                }
                else {
                    onDuplicate(node, value);
                    return node;
                }
            }
        }
    }
    function _rebalance(node, balance) {
        while (node !== null) {
            balance = (node.balance += balance);
            if (balance === 0) {
                break;
            }
            if (balance === 2) {
                if (node.left.balance === 1) {
                    _rotateRight.call(this, node);
                }
                else {
                    _rotateLeftRight.call(this, node);
                }
                break;
            }
            if (balance === -2) {
                if (node.right.balance === -1) {
                    _rotateLeft.call(this, node);
                }
                else {
                    _rotateRightLeft.call(this, node);
                }
                break;
            }
            var parent = node.parent;
            if (parent !== null) {
                balance = ((parent.left === node) ? 1 : -1);
            }
            node = parent;
        }
    }
    function _unbalance(treeNode, balance) {
        while (treeNode !== null) {
            balance = (treeNode.balance += balance);
            if (balance === 2) {
                if (treeNode.left.balance >= 0) {
                    treeNode = _rotateRight.call(this, treeNode);
                    if (treeNode.balance === -1) {
                        break;
                    }
                }
                else {
                    treeNode = _rotateLeftRight.call(this, treeNode);
                }
            }
            else {
                if (balance === -2) {
                    if (treeNode.right.balance <= 0) {
                        treeNode = _rotateLeft.call(this, treeNode);
                        if (treeNode.balance === 1) {
                            break;
                        }
                    }
                    else {
                        treeNode = _rotateRightLeft.call(this, treeNode);
                    }
                }
                else {
                    if (balance !== 0) {
                        break;
                    }
                }
            }
            var parent = treeNode.parent;
            if (parent !== null) {
                balance = ((parent.left === treeNode) ? -1 : 1);
            }
            treeNode = parent;
        }
    }
    function _rotateLeft(node) {
        var right = node.right;
        var left = right.left;
        var parent = node.parent;
        right.parent = parent;
        right.left = node;
        node.right = left;
        node.parent = right;
        if (left !== null) {
            left.parent = node;
        }
        if (node === this.root) {
            this.root = right;
        }
        else if (parent.right === node) {
            parent.right = right;
        }
        else {
            parent.left = right;
        }
        right.balance++;
        node.balance = -right.balance;
        return right;
    }
    function _rotateRight(node) {
        var left = node.left;
        var right = left.right;
        var parent = node.parent;
        left.parent = parent;
        left.right = node;
        node.left = right;
        node.parent = left;
        if (right !== null) {
            right.parent = node;
        }
        if (node === this.root) {
            this.root = left;
        }
        else if (parent.left === node) {
            parent.left = left;
        }
        else {
            parent.right = left;
        }
        left.balance--;
        node.balance = -left.balance;
        return left;
    }
    function _rotateLeftRight(node) {
        var left = node.left;
        var leftRight = left.right;
        var parent = node.parent;
        var leftRightRight = leftRight.right;
        var leftRightLeft = leftRight.left;
        leftRight.parent = parent;
        node.left = leftRightRight;
        left.right = leftRightLeft;
        leftRight.left = left;
        leftRight.right = node;
        left.parent = leftRight;
        node.parent = leftRight;
        if (leftRightRight !== null)
            leftRightRight.parent = node;
        if (leftRightLeft !== null)
            leftRightLeft.parent = left;
        if (node === this.root) {
            this.root = leftRight;
        }
        else {
            if (parent.left === node) {
                parent.left = leftRight;
            }
            else {
                parent.right = leftRight;
            }
        }
        if (leftRight.balance === -1) {
            node.balance = 0;
            left.balance = 1;
        }
        else {
            if (leftRight.balance === 0) {
                node.balance = 0;
                left.balance = 0;
            }
            else {
                node.balance = -1;
                left.balance = 0;
            }
        }
        leftRight.balance = 0;
        return leftRight;
    }
    function _rotateRightLeft(treeNode) {
        var right = treeNode.right;
        var rightLeft = right.left;
        var parent = treeNode.parent;
        var rightLeftLeft = rightLeft.left;
        var rightLeftRight = rightLeft.right;
        rightLeft.parent = parent;
        treeNode.right = rightLeftLeft;
        right.left = rightLeftRight;
        rightLeft.right = right;
        rightLeft.left = treeNode;
        right.parent = rightLeft;
        treeNode.parent = rightLeft;
        if (rightLeftLeft !== null) {
            rightLeftLeft.parent = treeNode;
        }
        if (rightLeftRight !== null) {
            rightLeftRight.parent = right;
        }
        if (treeNode === this.root) {
            this.root = rightLeft;
        }
        else {
            if (parent.right === treeNode) {
                parent.right = rightLeft;
            }
            else {
                parent.left = rightLeft;
            }
        }
        if (rightLeft.balance === 1) {
            treeNode.balance = 0;
            right.balance = -1;
        }
        else if (rightLeft.balance === 0) {
            treeNode.balance = 0;
            right.balance = 0;
        }
        else {
            treeNode.balance = 1;
            right.balance = 0;
        }
        rightLeft.balance = 0;
        return rightLeft;
    }
    var AvlTree = (function () {
        function AvlTree(comparer) {
            this.count = 0;
            this.root = null;
            this.comparer = comparer;
        }
        AvlTree.prototype.remove = function (key) {
            var node = this.root;
            while (node !== null) {
                if (this.comparer(key, node.key) < 0) {
                    node = node.left;
                }
                else {
                    if (this.comparer(key, node.key) <= 0) {
                        var left = node.left;
                        var right = node.right;
                        if (left === null) {
                            if (right === null) {
                                if (node === this.root) {
                                    this.root = null;
                                }
                                else {
                                    var parent = node.parent;
                                    if (parent.left === node) {
                                        parent.left = null;
                                        _unbalance.call(this, parent, -1);
                                    }
                                    else {
                                        parent.right = null;
                                        _unbalance.call(this, parent, 1);
                                    }
                                }
                            }
                            else {
                                _replace(node, right);
                                _unbalance.call(this, node, 0);
                            }
                        }
                        else {
                            if (right === null) {
                                _replace(node, left);
                                _unbalance.call(this, node, 0);
                            }
                            else {
                                var successor = right;
                                if (successor.left === null) {
                                    var parent = node.parent;
                                    successor.parent = parent;
                                    successor.left = left;
                                    successor.balance = node.balance;
                                    left.parent = successor;
                                    if (node === this.root) {
                                        this.root = successor;
                                    }
                                    else {
                                        if (parent.left === node) {
                                            parent.left = successor;
                                        }
                                        else {
                                            parent.right = successor;
                                        }
                                    }
                                    _unbalance.call(this, successor, 1);
                                }
                                else {
                                    while (successor.left !== null) {
                                        successor = successor.left;
                                    }
                                    var parent = node.parent;
                                    var parent2 = successor.parent;
                                    var right2 = successor.right;
                                    if (parent2.left === successor) {
                                        parent2.left = right2;
                                    }
                                    else {
                                        parent2.right = right2;
                                    }
                                    if (right2 !== null) {
                                        right2.parent = parent2;
                                    }
                                    successor.parent = parent;
                                    successor.left = left;
                                    successor.balance = node.balance;
                                    successor.right = right;
                                    right.parent = successor;
                                    left.parent = successor;
                                    if (node === this.root) {
                                        this.root = successor;
                                    }
                                    else {
                                        if (parent.left === node) {
                                            parent.left = successor;
                                        }
                                        else {
                                            parent.right = successor;
                                        }
                                    }
                                    _unbalance.call(this, parent2, -1);
                                }
                            }
                        }
                        return node.value;
                    }
                    node = node.right;
                }
            }
            return null;
        };
        AvlTree.prototype.find = function (key) {
            var node = this.root;
            var comparer = this.comparer;
            if (node !== null) {
                while (true) {
                    if (comparer(key, node.key) < 0) {
                        if (node.left) {
                            node = node.left;
                        }
                        else {
                            return null;
                        }
                    }
                    else if (comparer(key, node.key)) {
                        if (node.right) {
                            node = node.right;
                        }
                        else {
                            return null;
                        }
                    }
                    else {
                        return node;
                    }
                }
            }
            return null;
        };
        AvlTree.prototype.min = function () {
            var avlTreeNode = this.root;
            while (avlTreeNode.left !== null) {
                avlTreeNode = avlTreeNode.left;
            }
            return avlTreeNode;
        };
        AvlTree.prototype.max = function () {
            var avlTreeNode = this.root;
            while (avlTreeNode.right !== null) {
                avlTreeNode = avlTreeNode.right;
            }
            return avlTreeNode;
        };
        AvlTree.prototype.next = function (curr) {
            return _step(curr, "left", "right");
        };
        AvlTree.prototype.prev = function (curr) {
            return _step(curr, "right", "left");
        };
        AvlTree.prototype.findNext = function (key) {
            return _findNode(this.comparer, this.root, key, _identity, this.next, this.next);
        };
        AvlTree.prototype.findPrev = function (key) {
            return _findNode(this.comparer, this.root, key, this.prev, _identity, this.prev);
        };
        AvlTree.prototype.findCurrOrNext = function (key) {
            return _findNode(this.comparer, this.root, key, _identity, this.next, _identity);
        };
        AvlTree.prototype.findCurrOrPrev = function (key) {
            return _findNode(this.comparer, this.root, key, this.prev, _identity, _identity);
        };
        AvlTree.prototype.iterateForward = function (curr, fn) {
            return _iterate(curr, 'left', 'right', fn);
        };
        AvlTree.prototype.iterateReverse = function (curr, fn) {
            return _iterate(curr, 'right', 'left', fn);
        };
        AvlTree.prototype.add = function (key, value) {
            return _insert.call(this, key, value, _throwDuplicateKeyException);
        };
        AvlTree.prototype.put = function (key, value) {
            return _insert.call(this, key, value, _setValue);
        };
        AvlTree.prototype.getOrAdd = function (key, value) {
            return _insert.call(this, key, value, _identity).value;
        };
        AvlTree.prototype.getOrAddLazy = function (key, value) {
            return _insertLazy.call(this, key, value, _identity).value;
        };
        AvlTree.prototype.clear = function () {
            this.root = null;
            this.count = 0;
        };
        AvlTree.prototype.toList = function () {
            var result = [];
            this.iterateForward(this.min(), function (node) {
                result.push({
                    key: node.key,
                    value: node.value
                });
            });
            return result;
        };
        return AvlTree;
    })();
    Reflex.AvlTree = AvlTree;
})(Reflex || (Reflex = {}));
var Reflex;
(function (Reflex) {
    var Stemmers;
    (function (Stemmers) {
        var Porter;
        (function (Porter) {
            // Reference Javascript Porter Stemmer. This code corresponds to the original
            // 1980 paper available here: http://tartarus.org/martin/PorterStemmer/def.txt
            // The latest version of this code is available at https://github.com/kristopolous/Porter-Stemmer
            //
            // Original comment:
            // Porter stemmer in Javascript. Few comments, but it's easy to follow against the rules in the original
            // paper, in
            //
            //  Porter, 1980, An algorithm for suffix stripping, Program, Vol. 14,
            //  no. 3, pp 130-137,
            //
            // see also http://www.tartarus.org/~martin/PorterStemmer
            var step2list = {
                "ational": "ate",
                "tional": "tion",
                "enci": "ence",
                "anci": "ance",
                "izer": "ize",
                "bli": "ble",
                "alli": "al",
                "entli": "ent",
                "eli": "e",
                "ousli": "ous",
                "ization": "ize",
                "ation": "ate",
                "ator": "ate",
                "alism": "al",
                "iveness": "ive",
                "fulness": "ful",
                "ousness": "ous",
                "aliti": "al",
                "iviti": "ive",
                "biliti": "ble",
                "logi": "log"
            }, step3list = {
                "icate": "ic",
                "ative": "",
                "alize": "al",
                "iciti": "ic",
                "ical": "ic",
                "ful": "",
                "ness": ""
            }, c = "[^aeiou]", v = "[aeiouy]", C = c + "[^aeiouy]*", V = v + "[aeiou]*", mgr0 = "^(" + C + ")?" + V + C, meq1 = "^(" + C + ")?" + V + C + "(" + V + ")?$", mgr1 = "^(" + C + ")?" + V + C + V + C, s_v = "^(" + C + ")?" + v; // vowel in stem
            Porter.Stemmer = function (w) {
                var stem, suffix, firstch, re, re2, re3, re4, origword = w;
                if (w.length < 3) {
                    return w;
                }
                firstch = w.substr(0, 1);
                if (firstch == "y") {
                    w = firstch.toUpperCase() + w.substr(1);
                }
                // Step 1a
                re = /^(.+?)(ss|i)es$/;
                re2 = /^(.+?)([^s])s$/;
                if (re.test(w)) {
                    w = w.replace(re, "$1$2");
                }
                else if (re2.test(w)) {
                    w = w.replace(re2, "$1$2");
                }
                // Step 1b
                re = /^(.+?)eed$/;
                re2 = /^(.+?)(ed|ing)$/;
                if (re.test(w)) {
                    var fp = re.exec(w);
                    re = new RegExp(mgr0);
                    if (re.test(fp[1])) {
                        re = /.$/;
                        w = w.replace(re, "");
                    }
                }
                else if (re2.test(w)) {
                    var fp = re2.exec(w);
                    stem = fp[1];
                    re2 = new RegExp(s_v);
                    if (re2.test(stem)) {
                        w = stem;
                        re2 = /(at|bl|iz)$/;
                        re3 = new RegExp("([^aeiouylsz])\\1$");
                        re4 = new RegExp("^" + C + v + "[^aeiouwxy]$");
                        if (re2.test(w)) {
                            w = w + "e";
                        }
                        else if (re3.test(w)) {
                            re = /.$/;
                            w = w.replace(re, "");
                        }
                        else if (re4.test(w)) {
                            w = w + "e";
                        }
                    }
                }
                // Step 1c
                re = new RegExp("^(.*" + v + ".*)y$");
                if (re.test(w)) {
                    var fp = re.exec(w);
                    stem = fp[1];
                    w = stem + "i";
                }
                // Step 2
                re = /^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/;
                if (re.test(w)) {
                    var fp = re.exec(w);
                    stem = fp[1];
                    suffix = fp[2];
                    re = new RegExp(mgr0);
                    if (re.test(stem)) {
                        w = stem + step2list[suffix];
                    }
                }
                // Step 3
                re = /^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/;
                if (re.test(w)) {
                    var fp = re.exec(w);
                    stem = fp[1];
                    suffix = fp[2];
                    re = new RegExp(mgr0);
                    if (re.test(stem)) {
                        w = stem + step3list[suffix];
                    }
                }
                // Step 4
                re = /^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/;
                re2 = /^(.+?)(s|t)(ion)$/;
                if (re.test(w)) {
                    var fp = re.exec(w);
                    stem = fp[1];
                    re = new RegExp(mgr1);
                    if (re.test(stem)) {
                        w = stem;
                    }
                }
                else if (re2.test(w)) {
                    var fp = re2.exec(w);
                    stem = fp[1] + fp[2];
                    re2 = new RegExp(mgr1);
                    if (re2.test(stem)) {
                        w = stem;
                    }
                }
                // Step 5
                re = /^(.+?)e$/;
                if (re.test(w)) {
                    var fp = re.exec(w);
                    stem = fp[1];
                    re = new RegExp(mgr1);
                    re2 = new RegExp(meq1);
                    re3 = new RegExp("^" + C + v + "[^aeiouwxy]$");
                    if (re.test(stem) || (re2.test(stem) && !(re3.test(stem)))) {
                        w = stem;
                    }
                }
                re = /ll$/;
                re2 = new RegExp(mgr1);
                if (re.test(w) && re2.test(w)) {
                    re = /.$/;
                    w = w.replace(re, "");
                }
                // and turn initial Y back to y
                if (firstch == "y") {
                    w = firstch.toLowerCase() + w.substr(1);
                }
                return w;
            };
        })(Porter = Stemmers.Porter || (Stemmers.Porter = {}));
    })(Stemmers = Reflex.Stemmers || (Reflex.Stemmers = {}));
})(Reflex || (Reflex = {}));
var Reflex;
(function (Reflex) {
    function _createTerms() {
        return {};
    }
    function _ascendingComparison(a, b) {
        if (a < b) {
            return -1;
        }
        else if (a > b) {
            return 1;
        }
        else {
            return 0;
        }
    }
    function _descendingComparison(a, b) {
        if (a < b) {
            return 1;
        }
        else if (a > b) {
            return -1;
        }
        else {
            return 0;
        }
    }
    function _binarySearch(list, key, none, min, max, below, above, center, comparison) {
        if (list.length > 0) {
            while (true) {
                var mid = (min + max) >> 1;
                var cmp = comparison(key, list[mid]);
                if (cmp < 0) {
                    max = mid - 1;
                    if (min > max) {
                        return below(list, mid);
                    }
                }
                else if (cmp > 0) {
                    min = mid + 1;
                    if (min > max) {
                        return above(list, mid);
                    }
                }
                else {
                    return center(list, mid);
                }
            }
        }
        return none;
    }
    function _prevBinarySearch(list, key, none, comparison) {
        return _binarySearch(list, key, none, 0, list.length - 1, function (l, i) { return i - 1 >= 0 ? l[i - 1] : none; }, function (l, i) { return l[i]; }, function (l, i) { return i - 1 >= 0 ? l[i - 1] : none; }, comparison);
    }
    function _nextBinarySearch(list, key, none, comparison) {
        return _binarySearch(list, key, none, 0, list.length - 1, function (l, i) { return l[i]; }, function (l, i) { return i + 1 < l.length ? l[i + 1] : none; }, function (l, i) { return i + 1 < l.length ? l[i + 1] : none; }, comparison);
    }
    function _currOrNextBinarySearch(list, key, none, comparison) {
        return _binarySearch(list, key, none, 0, list.length - 1, function (l, i) { return i - 1 >= 0 ? l[i - 1] : none; }, function (l, i) { return l[i]; }, function (l, i) { return l[i]; }, comparison);
    }
    function _currOrPrevBinarySearch(list, key, none, comparison) {
        return _binarySearch(list, key, none, 0, list.length - 1, function (l, i) { return l[i]; }, function (l, i) { return i + 1 < l.length ? l[i + 1] : none; }, function (l, i) { return l[i]; }, comparison);
    }
    var Index = (function () {
        function Index(configuration) {
            this.documentsCount = 0;
            this.documents = {};
            this.documentsByVersion = {};
            this.insertPipeline = configuration.insertPipeline;
            this.searchPipeline = configuration.searchPipeline;
            this.corpus = new Reflex.AvlTree(_ascendingComparison);
        }
        Index.prototype.add = function (reference, $vid, value) {
            var $did = this.documentsCount++;
            var tokens = value;
            var pipeline = this.insertPipeline, count = pipeline.length;
            for (var index = 0; index < count; index++) {
                tokens = pipeline[index](tokens);
            }
            var corpus = this.corpus;
            var count = tokens.length;
            var documentTerms = {};
            var documentTermsCount = 0;
            for (var index = 0; index < count; index++) {
                var token = tokens[index];
                var termsContainer = corpus.getOrAddLazy(token, _createTerms);
                var term = termsContainer[token];
                if (!term) {
                    term = termsContainer[token] = {
                        value: token,
                        positions: {},
                        positionsCount: 0
                    };
                }
                if (!documentTerms[token]) {
                    documentTermsCount++;
                    documentTerms[token] = term;
                }
                var termPositions = term.positions;
                var termPositionsInDocument = termPositions[$did];
                if (!termPositionsInDocument) {
                    term.positionsCount++;
                    termPositionsInDocument = termPositions[$did] = [];
                }
                termPositionsInDocument.push(index);
                var tokenLength = token.length;
                for (var i = 1; i < tokenLength; i++) {
                    corpus.getOrAddLazy(token.substring(i), _createTerms)[token] = term;
                }
            }
            var norm = 0.0;
            for (token in documentTerms) {
                var occurances = documentTerms[token].positions[$did].length;
                norm += occurances * occurances;
            }
            norm = Math.sqrt(norm);
            var document = {
                $did: $did,
                $norm: norm,
                $value: value,
                $terms: documentTerms,
                $termsCount: documentTermsCount,
                $vid: $vid,
                $reference: reference
            };
            this.documents[$did] = document;
            (this.documentsByVersion[$vid] || (this.documentsByVersion[$vid] = {}))[$did] = document;
            return document;
        };
        Index.prototype.intersect = function (query, intersection, iterator) {
            var tokens = query;
            var documents = this.documents, pipeline = this.insertPipeline, count = pipeline.length;
            for (var index = 0; index < count; index++) {
                tokens = pipeline[index](tokens);
            }
            var corpus = this.corpus;
            var count = tokens.length;
            var queryTermsByToken = [];
            var queryTermsFrequencies = {};
            var queryTermsCountsByToken = [];
            var queryDocumentsByToken = [];
            var token, queryTerms, queryTermsCount;
            var queryDocuments = {};
            var queryDocumentsCount = 0;
            var fn = intersection ? function (node) {
                if (node.key.lastIndexOf(token, 0) > -1) {
                    var terms = node.value;
                    for (var termString in terms) {
                        var term = terms[termString];
                        var termPositions = term.positions;
                        if (!queryTerms[termString]) {
                            queryTerms[termString] = term;
                            queryTermsCount++;
                        }
                        queryTermsFrequencies[termString] = (queryTermsFrequencies[termString] || 0) + 1;
                        for (var docId in termPositions) {
                            var document = documents[docId];
                            var searchResult = intersection[document.$vid];
                            if (searchResult) {
                                if (!queryDocuments[docId]) {
                                    queryDocuments[docId] = documents[docId];
                                    queryDocumentsCount++;
                                }
                            }
                        }
                    }
                }
                else {
                    return true; // returning non undefined result would break the iteration
                }
            } : function (node) {
                if (node.key.lastIndexOf(token, 0) > -1) {
                    var terms = node.value;
                    for (var termString in terms) {
                        var term = terms[termString];
                        var termPositions = term.positions;
                        if (!queryTerms[termString]) {
                            queryTerms[termString] = term;
                            queryTermsCount++;
                        }
                        queryTermsFrequencies[termString] = (queryTermsFrequencies[termString] || 0) + 1;
                        for (var docId in termPositions) {
                            var document = documents[docId];
                            if (!queryDocuments[docId]) {
                                queryDocuments[docId] = documents[docId];
                                queryDocumentsCount++;
                            }
                        }
                    }
                }
                else {
                    return true; // returning non undefined result would break the iteration
                }
            };
            for (var index = 0; index < count; index++) {
                var token = tokens[index];
                var queryTerms = {};
                var queryTermsCount = 0;
                var queryDocuments = {};
                var queryDocumentsCount = 0;
                corpus.iterateForward(corpus.findCurrOrNext(token), fn);
                queryTermsByToken.push(queryTerms);
                queryTermsCountsByToken.push(queryTermsCount);
                queryDocumentsByToken.push({
                    hash: queryDocuments,
                    capacity: queryDocumentsCount
                });
            }
            var queryNorm = 0.0;
            for (var termKey in queryTermsFrequencies) {
                var value = queryTermsFrequencies[termKey];
                queryNorm += value * value;
            }
            queryNorm = Math.sqrt(queryNorm);
            for (var termKey in queryTermsFrequencies) {
                queryTermsFrequencies[termKey] /= queryNorm;
            }
            queryDocumentsByToken.sort(function (a, b) {
                return a.capacity - b.capacity;
            });
            if (count > 1) {
                var queryDocumentsIntersection;
                var queryDocumentsIntersectionCapacity;
                var queryDocumentsIntersectionArgument = queryDocumentsByToken[0].hash;
                for (var index = 1; index < count; index++) {
                    queryDocumentsIntersection = {};
                    queryDocumentsIntersectionCapacity = 0;
                    var hash = queryDocumentsByToken[index].hash;
                    for (var queryDocumentsIntersectionKey in queryDocumentsIntersectionArgument) {
                        if (hash[queryDocumentsIntersectionKey]) {
                            queryDocumentsIntersectionCapacity++;
                            queryDocumentsIntersection[queryDocumentsIntersectionKey] = hash[queryDocumentsIntersectionKey];
                        }
                    }
                    queryDocumentsIntersectionArgument = queryDocumentsIntersection;
                }
            }
            else if (count > 0) {
                var queryDocumentsIntersection = queryDocumentsByToken[0].hash;
                var queryDocumentsIntersectionCapacity = queryDocumentsByToken[0].capacity;
                var queryDocumentsIntersectionArgument = queryDocumentsIntersection;
            }
            else {
                return [];
            }
            for (var queryDocumentsIntersectionKey in queryDocumentsIntersection) {
                var score = 0.0;
                var position = -Infinity;
                var documentsCount = this.documentsCount;
                var document = queryDocumentsIntersection[queryDocumentsIntersectionKey];
                var $did = document.$did;
                var $norm = document.$norm;
                var $terms = document.$terms;
                var $termsCount = document.$termsCount;
                var include = true;
                for (var index = 0; index < count; index++) {
                    var queryTerms = queryTermsByToken[index];
                    var minimalTermsPosition = Infinity;
                    var minimalTermsPositionFound = false;
                    var documentQueryTerms = [];
                    if (queryTermsCountsByToken[index] < $termsCount) {
                        for (var termKey in queryTerms) {
                            var term = $terms[termKey];
                            if (term) {
                                documentQueryTerms.push(term);
                            }
                        }
                    }
                    else {
                        for (var termKey in $terms) {
                            var term = queryTerms[termKey];
                            if (term) {
                                documentQueryTerms.push(term);
                            }
                        }
                    }
                    var documentQueryTermsLength = documentQueryTerms.length;
                    for (var termIndex = 0; termIndex < documentQueryTermsLength && minimalTermsPosition !== 0 && minimalTermsPosition !== position; termIndex++) {
                        var term = documentQueryTerms[termIndex];
                        var positions = term.positions[$did];
                        score += (positions.length / $norm) * Math.log(1 + documentsCount / term.positionsCount) * queryTermsFrequencies[term.value]; // TODO: Check term.value
                        var nearest = _nextBinarySearch(positions, position, null, _ascendingComparison);
                        if (nearest !== null && nearest < minimalTermsPosition) {
                            minimalTermsPosition = nearest;
                            minimalTermsPositionFound = true;
                        }
                    }
                    if (minimalTermsPositionFound) {
                        position = minimalTermsPosition;
                    }
                    else {
                        include = false;
                        break;
                    }
                }
                if (include) {
                    var result = iterator(score, document);
                    if (result !== void 0) {
                        return result;
                    }
                }
            }
            return void 0;
        };
        Index.prototype.remove = function ($vid) {
            var corpus = this.corpus;
            var documentsByVersion = this.documentsByVersion[$vid];
            for (var $did in documentsByVersion) {
                var token;
                var document = documentsByVersion[$did];
                var documentTerms = document.$terms;
                for (token in documentTerms) {
                    var term = documentTerms[token];
                    var positions = term.positions;
                    if (delete positions[$did]) {
                        if (--term.positionsCount < 1) {
                            var tokenLength = token.length; // There are no positions left for this term, it is no longer exists anywhere, all of it's references should be removed
                            for (var i = 0; i < tokenLength; i++) {
                                var part = token.substring(i);
                                var terms = corpus.find(part).value;
                                if (terms) {
                                    if (delete terms[token]) {
                                        var noTermsLeft = true;
                                        for (var key in terms) {
                                            noTermsLeft = false;
                                            break;
                                        }
                                        if (noTermsLeft) {
                                            if (!corpus.remove(part)) {
                                                throw new Error('Was unable to remove part from the corpus, this is a sign of data corruption or bug in Reflex, please contact Reflex dev team via creating an issue on Refliex github page');
                                            }
                                        }
                                    }
                                    else {
                                        throw new Error('A term dictionary hashed by token didn\'t contain current token, however it should have existed, this is a sign of data corruption or bug in Reflex, please contact Reflex dev team via creating an issue on Refliex github page');
                                    }
                                }
                                else {
                                    throw new Error("Part wasn't found in corpus, however it should have existed, this is a sign of data corruption or bug in Reflex, please contact Reflex dev team via creating an issue on Refliex github page");
                                }
                            }
                        }
                    }
                    else {
                        throw new Error("Positions collection didn't contain the searched $did, this is a sign of bug in Reflex, please contact Reflex dev team via creating an issue on Refliex github page");
                    }
                }
            }
            if (!delete this.documentsByVersion[$vid]) {
                throw new Error("Was unable to remove version from documentsByVersion, this is a sign of bug in Reflex, please contact Reflex dev team via creating an issue on Refliex github page");
            }
        };
        return Index;
    })();
    Reflex.Index = Index;
})(Reflex || (Reflex = {}));
var Reflex;
(function (Reflex) {
    'use strict';
    var emptyHash = {};
    var emptyList = [];
    (function (Type) {
        Type[Type["Atom"] = 0] = "Atom";
        Type[Type["Hash"] = 1] = "Hash";
        Type[Type["Array"] = 2] = "Array";
        Type[Type["Reference"] = 3] = "Reference";
    })(Reflex.Type || (Reflex.Type = {}));
    var Type = Reflex.Type;
    var Version = (function () {
        function Version($vid, $cid, $rid, $) {
            this.$vid = $vid;
            this.$cid = $cid;
            this.$rid = $rid;
            this.$ = $;
        }
        return Version;
    })();
    Reflex.Version = Version;
    var isEmpty = function (obj) {
        for (var i in obj) {
            return false;
        }
        return true;
    };
    var toString = Object.prototype.toString;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    function foreach(obj, fn, ctx) {
        if (toString.call(fn) !== '[object Function]') {
            throw new TypeError('iterator must be a function');
        }
        var l = obj.length, i, r;
        if (l === +l) {
            for (i = 0; i < l; i += 1) {
                r = fn.call(ctx, obj[i], i, obj);
                if (r !== undefined) {
                    return r;
                }
            }
        }
        else {
            for (i in obj) {
                if (hasOwnProperty.call(obj, i)) {
                    r = fn.call(ctx, obj[i], i, obj);
                    if (r !== undefined) {
                        return r;
                    }
                }
            }
        }
    }
    function Throw(message) {
        throw new Error(message);
    }
    function ThrowPureAbstractCall() {
        throw new Error('A pure abstract call was issued');
    }
    function ThrowArgumentNullException(parameterName) {
        if (parameterName) {
            throw new Error('Argument "' + parameterName + '" was not defined');
        }
        else {
            throw new Error('Argument not defined');
        }
    }
    function ThrowInvalidOperationException() {
        Throw('Invalid operation');
    }
    var Reference = (function () {
        function Reference(repo, $rid, table) {
            this.repo = repo;
            this.$rid = $rid;
            this.table = table;
            this.owners = {};
            this.versions = {};
        }
        return Reference;
    })();
    Reflex.Reference = Reference;
    var TypeDescriptor = (function () {
        function TypeDescriptor(repo, tableDescriptor, propertyDescriptor, type) {
            this.repo = repo;
            this.tableDescriptor = tableDescriptor;
            this.propertyDescriptor = propertyDescriptor;
            this.type = type;
        }
        TypeDescriptor.fromRecord = function (repo, tableDescriptor, propertyDescriptor, typeDeclaration, descriptorCache) {
            if (typeDeclaration) {
                var typeName, indexConfigurationName;
                if (typeDeclaration.type) {
                    if (typeDeclaration.type.name) {
                        typeName = typeDeclaration.type.name;
                        indexConfigurationName = typeDeclaration.type.index || tableDescriptor.repo.defaultIndexConfiguration;
                    }
                    else {
                        typeName = typeDeclaration.type;
                        indexConfigurationName = typeDeclaration.index || tableDescriptor.repo.defaultIndexConfiguration;
                    }
                }
                else {
                    typeName = typeDeclaration;
                    indexConfigurationName = tableDescriptor.repo.defaultIndexConfiguration;
                }
                switch (typeName) {
                    case Type[0 /* Atom */]:
                        return new AtomDescriptor(repo, tableDescriptor, propertyDescriptor, tableDescriptor.repo.indexConfigurations[indexConfigurationName] || Throw('Index configuration "' + indexConfigurationName + '" not found'));
                    case Type[1 /* Hash */]:
                        return new HashDescriptor(repo, tableDescriptor, propertyDescriptor, TypeDescriptor.fromRecord(repo, tableDescriptor, propertyDescriptor, typeDeclaration.of, descriptorCache));
                    case Type[2 /* Array */]:
                        return new ArrayDescriptor(repo, tableDescriptor, propertyDescriptor, TypeDescriptor.fromRecord(repo, tableDescriptor, propertyDescriptor, typeDeclaration.of, descriptorCache));
                    case Type[3 /* Reference */]:
                        return new ReferenceDescriptor(repo, tableDescriptor, propertyDescriptor, descriptorCache(typeDeclaration.of));
                    default:
                        return new ReferenceDescriptor(repo, tableDescriptor, propertyDescriptor, descriptorCache(typeName));
                }
            }
            else {
                ThrowArgumentNullException('typeDeclaration');
            }
        };
        TypeDescriptor.prototype.index = function (reference, $vid, value) {
            ThrowPureAbstractCall();
        };
        TypeDescriptor.prototype.deindex = function ($vid) {
            ThrowPureAbstractCall();
        };
        TypeDescriptor.prototype.intersect = function (query, intersection, fn) {
            return ThrowPureAbstractCall();
        };
        TypeDescriptor.prototype.recursiveSearchToken = function (token, cache) {
            return ThrowPureAbstractCall();
        };
        TypeDescriptor.prototype.export = function ($vid, model) {
            return ThrowPureAbstractCall();
        };
        TypeDescriptor.prototype.import = function ($vid, model) {
            return ThrowPureAbstractCall();
        };
        return TypeDescriptor;
    })();
    Reflex.TypeDescriptor = TypeDescriptor;
    var CollectionDescriptor = (function (_super) {
        __extends(CollectionDescriptor, _super);
        function CollectionDescriptor(repo, tableDescriptor, propertyDescriptor, type, of) {
            _super.call(this, repo, tableDescriptor, propertyDescriptor, type);
            this.of = of;
            if (of instanceof CollectionDescriptor) {
                this.baseType = of.baseType;
            }
            else if (of instanceof TerminalDescriptor) {
                this.baseType = of;
            }
            else {
                throw new Error('Unexpected descriptor type');
            }
        }
        CollectionDescriptor.prototype.intersect = function (query, intersection, fn) {
            return this.of.intersect(query, intersection, fn);
        };
        CollectionDescriptor.prototype.recursiveSearchToken = function (token, cache) {
            return this.of.recursiveSearchToken(token, cache);
        };
        CollectionDescriptor.prototype.reference = function (references, ownerRecord, owner, value) {
            return ThrowPureAbstractCall();
        };
        CollectionDescriptor.prototype.checkout = function (records, model, cache, result) {
            return ThrowPureAbstractCall();
        };
        CollectionDescriptor.prototype.clone = function (value) {
            return ThrowPureAbstractCall();
        };
        CollectionDescriptor.prototype.contains = function (value, query, cache) {
            return ThrowPureAbstractCall();
        };
        CollectionDescriptor.prototype.changed = function (models, protos) {
            return ThrowPureAbstractCall();
        };
        CollectionDescriptor.prototype.dereference = function (models) {
            return ThrowPureAbstractCall();
        };
        CollectionDescriptor.prototype.cleanup = function (references, ownerRecord, value) {
            return ThrowPureAbstractCall();
        };
        return CollectionDescriptor;
    })(TypeDescriptor);
    Reflex.CollectionDescriptor = CollectionDescriptor;
    var ArrayDescriptor = (function (_super) {
        __extends(ArrayDescriptor, _super);
        function ArrayDescriptor(repo, tableDescriptor, propertyDescriptor, of) {
            _super.call(this, repo, tableDescriptor, propertyDescriptor, 2 /* Array */, of);
            if (of instanceof TerminalDescriptor) {
                this.reference = this.referenceTerminal;
                this.checkout = this.checkoutTerminal;
                this.cleanup = this.cleanupTerminal;
                this.clone = this.cloneTerminal;
                if (of instanceof AtomDescriptor) {
                    this.changed = this.changedTerminalAtom;
                    this.contains = this.containsTerminalAtom;
                    this.dereference = this.dereferenceTerminalAtom;
                }
                else if (of instanceof ReferenceDescriptor) {
                    this.changed = this.changedTerminalReference;
                    this.contains = this.containsTerminalReference;
                    this.dereference = this.dereferenceTerminalReference;
                }
                else {
                    Throw("Unexpected descriptor type");
                }
            }
            else {
                this.dereference = this.dereferenceCollection;
                this.reference = this.referenceCollection;
                this.checkout = this.checkoutCollection;
                this.contains = this.containsCollection;
                this.cleanup = this.cleanupCollection;
                this.changed = this.changedCollection;
                this.clone = this.cloneCollection;
            }
        }
        ArrayDescriptor.prototype.export = function (versions, models) {
            if (versions) {
                var of = this.of;
                models = models || [];
                models.length = versions.length;
                var versionsLength = versions.length;
                for (var index = 0; index < versionsLength; index++) {
                    models[index] = of.export(versions[index], models[index]);
                }
                return models;
            }
            else {
                return versions;
            }
        };
        ArrayDescriptor.prototype.import = function (versions, models) {
            if (models) {
                var of = this.of;
                versions = versions || [];
                versions.length = models.length;
                var modelsLength = models.length;
                for (var index = 0; index < modelsLength; index++) {
                    versions[index] = of.import(versions[index], models[index]);
                }
                return versions;
            }
            else {
                return models;
            }
        };
        ArrayDescriptor.prototype.index = function (reference, $vid, values) {
            var of = this.of;
            var count = values.length;
            for (var i = 0; i < count; i++) {
                var value = values[i];
                if (value) {
                    of.index(reference, $vid, value);
                }
            }
        };
        ArrayDescriptor.prototype.cleanupTerminal = function (references, record, referenceArray) {
            var propertyName = this.propertyDescriptor.name;
            var count = referenceArray.length;
            var $table = record.table;
            var $vid = record.vid;
            for (var i = 0; i < count; i++) {
                var reference = referenceArray[i];
                if (reference) {
                    var ownerProperties = reference.owners[$table];
                    if (ownerProperties) {
                        var table = ownerProperties[propertyName];
                        if (table) {
                            delete table[$vid];
                            if (isEmpty(table)) {
                                delete ownerProperties[propertyName];
                                if (isEmpty(ownerProperties)) {
                                    delete reference.owners[$table];
                                }
                            }
                        }
                        else {
                            if (isEmpty(ownerProperties)) {
                                delete reference.owners[$table];
                            }
                        }
                    }
                }
            }
        };
        ArrayDescriptor.prototype.cleanupCollection = function (references, record, models) {
            var of = this.of;
            var count = models.length;
            for (var i = 0; i < count; i++) {
                var reference = models[i];
                if (reference) {
                    of.cleanup(references, record, reference);
                }
            }
        };
        ArrayDescriptor.prototype.referenceTerminal = function (references, ownerRecord, owner, models) {
            var count = models.length;
            var ownerVersion = ownerRecord.vid;
            var ownerTable = ownerRecord.table;
            var referenceTableName = this.of.of.name;
            var referencePropertyName = this.propertyDescriptor.name;
            for (var i = 0; i < count; i++) {
                var $rid = models[i];
                if ($rid) {
                    var reference = models[i] = (references[$rid] || (references[$rid] = new Reference(this.repo, $rid, referenceTableName)));
                    var properties = reference.owners[ownerTable] || (reference.owners[ownerTable] = {});
                    var table = properties[referencePropertyName] || (properties[referencePropertyName] = {});
                    table[ownerVersion] = owner;
                }
            }
        };
        ArrayDescriptor.prototype.referenceCollection = function (references, ownerRecord, owner, models) {
            var of = this.of;
            var count = models.length;
            for (var i = 0; i < count; i++) {
                var reference = models[i];
                if (reference) {
                    of.reference(references, ownerRecord, owner, reference);
                }
            }
        };
        ArrayDescriptor.prototype.checkoutCollection = function (records, models, cache, result) {
            var of = this.of;
            var length = models.length;
            for (var i = 0; i < length; i++) {
                var model = models[i];
                if (model) {
                    of.checkout(records, model, cache, result);
                }
            }
        };
        ArrayDescriptor.prototype.checkoutTerminal = function (records, models, cache, result) {
            var length = models.length;
            for (var i = 0; i < length; i++) {
                var reference = models[i];
                if (reference) {
                    var versions = reference.versions;
                    for (var $vid in versions) {
                        if (!($vid in cache)) {
                            result.push(records[$vid]);
                            cache[$vid] = versions[$vid];
                        }
                    }
                }
            }
        };
        ArrayDescriptor.prototype.cloneCollection = function (protos) {
            var of = this.of;
            var result = [];
            var length = result.length = protos.length;
            for (var i = 0; i < length; i++) {
                var proto = protos[i];
                if (proto) {
                    result[i] = of.clone(proto);
                }
                else {
                    result[i] = proto;
                }
            }
            return result;
        };
        ArrayDescriptor.prototype.cloneTerminal = function (protos) {
            var result = [];
            var length = result.length = protos.length;
            for (var i = 0; i < length; i++) {
                result[i] = protos[i];
            }
            return result;
        };
        ArrayDescriptor.prototype.changedCollection = function (models, protos) {
            var of = this.of;
            if (models.length === protos.length) {
                var length = protos.length;
                for (var i = 0; i < length; i++) {
                    var model = models[i];
                    var proto = protos[i];
                    if (model && proto) {
                        if (of.changed(model, proto)) {
                            return true;
                        }
                    }
                    else if (model || proto || model !== proto) {
                        return true;
                    }
                }
            }
            else {
                return true;
            }
            return false;
        };
        ArrayDescriptor.prototype.changedTerminalAtom = function (models, protos) {
            if (models.length === protos.length) {
                var length = protos.length;
                for (var i = 0; i < length; i++) {
                    if (models[i] !== protos[i]) {
                        return true;
                    }
                }
            }
            else {
                return true;
            }
            return false;
        };
        ArrayDescriptor.prototype.changedTerminalReference = function (models, protos) {
            if (models.length === protos.length) {
                var length = protos.length;
                for (var i = 0; i < length; i++) {
                    var model = models[i];
                    var proto = protos[i];
                    if (model && proto) {
                        if (model.$rid !== proto) {
                            return true;
                        }
                    }
                    else if (model || proto || model !== proto) {
                        return true;
                    }
                }
            }
            else {
                return true;
            }
            return false;
        };
        ArrayDescriptor.prototype.containsCollection = function (collections, query, cache) {
            var of = this.of;
            var length = collections.length;
            for (var i = 0; i < length; i++) {
                var collection = collections[i];
                if (collection && of.contains(collection, query, cache))
                    return true;
            }
            return false;
        };
        ArrayDescriptor.prototype.containsTerminalAtom = function (collection, query, cache) {
            var of = this.of;
            var length = collection.length;
            for (var i = 0; i < length; i++) {
                var atom = collection[i];
                if (atom && query(atom))
                    return true;
            }
            return false;
        };
        ArrayDescriptor.prototype.containsTerminalReference = function (references, query, cache) {
            var of = this.of.of;
            var length = references.length;
            for (var i = 0; i < length; i++) {
                var reference = references[i];
                if (reference && of.contains(reference, query, cache))
                    return true;
            }
            return false;
        };
        ArrayDescriptor.prototype.dereferenceCollection = function (models) {
            var of = this.of;
            var result = [];
            var length = result.length = models.length;
            for (var i = 0; i < length; i++) {
                var model = models[i];
                if (model) {
                    result[i] = of.dereference(model);
                }
                else {
                    result[i] = model;
                }
            }
            return result;
        };
        ArrayDescriptor.prototype.dereferenceTerminalAtom = function (models) {
            var result = [];
            var length = result.length = models.length;
            for (var i = 0; i < length; i++) {
                result[i] = models[i];
            }
            return result;
        };
        ArrayDescriptor.prototype.dereferenceTerminalReference = function (models) {
            var result = [];
            var length = result.length = models.length;
            for (var i = 0; i < length; i++) {
                var model = models[i];
                if (model) {
                    result[i] = model.$rid;
                }
                else {
                    result[i] = model;
                }
            }
            return result;
        };
        return ArrayDescriptor;
    })(CollectionDescriptor);
    Reflex.ArrayDescriptor = ArrayDescriptor;
    var HashDescriptor = (function (_super) {
        __extends(HashDescriptor, _super);
        function HashDescriptor(repo, tableDescriptor, propertyDescriptor, of) {
            _super.call(this, repo, tableDescriptor, propertyDescriptor, 1 /* Hash */, of);
            if (of instanceof TerminalDescriptor) {
                this.reference = this.referenceTerminal;
                this.checkout = this.checkoutTerminal;
                this.cleanup = this.cleanupTerminal;
                this.clone = this.cloneTerminal;
                if (of instanceof AtomDescriptor) {
                    this.changed = this.changedTerminalAtom;
                    this.contains = this.containsTerminalAtom;
                    this.dereference = this.dereferenceTerminalAtom;
                }
                else if (of instanceof ReferenceDescriptor) {
                    this.changed = this.changedTerminalReference;
                    this.contains = this.containsTerminalReference;
                    this.dereference = this.dereferenceTerminalReference;
                }
                else {
                    Throw("Unexpected descriptor type");
                }
            }
            else {
                this.dereference = this.dereferenceCollection;
                this.reference = this.referenceCollection;
                this.checkout = this.checkoutCollection;
                this.contains = this.containsCollection;
                this.cleanup = this.cleanupCollection;
                this.changed = this.changedCollection;
                this.clone = this.cloneCollection;
            }
        }
        HashDescriptor.prototype.export = function (versions, models) {
            if (versions) {
                var of = this.of;
                models = models || {};
                for (var key in versions) {
                    models[key] = of.export(versions[key], models[key]);
                }
                return models;
            }
            else {
                return versions;
            }
        };
        HashDescriptor.prototype.import = function (versions, models) {
            if (models) {
                var of = this.of;
                versions = versions || {};
                for (var index in models) {
                    versions[index] = of.import(versions[index], models[index]);
                }
                return versions;
            }
            else {
                return models;
            }
        };
        HashDescriptor.prototype.index = function (reference, $vid, models) {
            var of = this.of;
            for (var key in models) {
                var model = models[key];
                if (model) {
                    of.index(reference, $vid, model);
                }
            }
        };
        HashDescriptor.prototype.cleanupTerminal = function (references, record, referenceHash) {
            var propertyName = this.propertyDescriptor.name;
            var $vid = record.vid;
            var $table = record.table;
            for (var key in referenceHash) {
                var reference = referenceHash[key];
                if (reference) {
                    var ownerProperties = reference.owners[$table];
                    if (ownerProperties) {
                        var table = ownerProperties[propertyName];
                        if (table) {
                            delete table[$vid];
                            if (isEmpty(table)) {
                                delete ownerProperties[propertyName];
                                if (isEmpty(ownerProperties)) {
                                    delete reference.owners[$table];
                                }
                            }
                        }
                        else {
                            if (isEmpty(ownerProperties)) {
                                delete reference.owners[$table];
                            }
                        }
                    }
                }
            }
        };
        HashDescriptor.prototype.cleanupCollection = function (references, record, models) {
            var of = this.of;
            for (var key in models) {
                var reference = models[key];
                if (reference) {
                    of.cleanup(references, record, reference);
                }
            }
        };
        HashDescriptor.prototype.referenceTerminal = function (references, ownerRecord, owner, models) {
            var ownerVersion = ownerRecord.vid;
            var ownerTable = ownerRecord.table;
            var referenceTableName = this.of.of.name;
            var referencePropertyName = this.propertyDescriptor.name;
            for (var key in models) {
                var $rid = models[key];
                if ($rid) {
                    var reference = models[key] = (references[$rid] || (references[$rid] = new Reference(this.repo, $rid, referenceTableName)));
                    var referenceProperties = reference.owners[ownerTable] || (reference.owners[ownerTable] = {});
                    var referenceTable = referenceProperties[referencePropertyName] || (referenceProperties[referencePropertyName] = {});
                    referenceTable[ownerVersion] = owner;
                }
            }
        };
        HashDescriptor.prototype.referenceCollection = function (references, ownerRecord, owners, models) {
            var of = this.of;
            for (var key in models) {
                var model = models[key];
                if (model) {
                    of.reference(references, ownerRecord, owners, model);
                }
            }
        };
        HashDescriptor.prototype.checkoutCollection = function (records, models, cache, result) {
            var of = this.of;
            for (var key in models) {
                var model = models[key];
                if (model) {
                    of.checkout(records, model, cache, result);
                }
            }
        };
        HashDescriptor.prototype.checkoutTerminal = function (records, models, cache, result) {
            for (var key in models) {
                var reference = models[key];
                if (reference) {
                    var versions = reference.versions;
                    for (var $vid in versions) {
                        if (!($vid in cache)) {
                            result.push(records[$vid]);
                            cache[$vid] = versions[$vid];
                        }
                    }
                }
            }
        };
        HashDescriptor.prototype.cloneCollection = function (protos) {
            var of = this.of;
            var result = {};
            for (var i in protos) {
                var proto = protos[i];
                if (proto) {
                    result[i] = of.clone(proto);
                }
                else {
                    result[i] = proto;
                }
            }
            return result;
        };
        HashDescriptor.prototype.cloneTerminal = function (protos) {
            var result = {};
            for (var key in protos) {
                result[key] = protos[key];
            }
            return result;
        };
        HashDescriptor.prototype.changedCollection = function (models, protos) {
            var of = this.of;
            for (var key in protos) {
                if (key in models) {
                    var model = models[key];
                    var proto = protos[key];
                    if (model && proto) {
                        if (of.changed(models[key], protos[key])) {
                            return true;
                        }
                    }
                    else if (model || proto || model !== proto) {
                        return true;
                    }
                }
                else {
                    return true;
                }
            }
            for (var key in models) {
                if (!(key in protos)) {
                    return true;
                }
            }
            return false;
        };
        HashDescriptor.prototype.changedTerminalAtom = function (models, protos) {
            for (var key in protos) {
                if (key in models) {
                    if (models[key] !== protos[key]) {
                        return true;
                    }
                }
                else {
                    return true;
                }
            }
            for (var key in models) {
                if (!(key in protos)) {
                    return true;
                }
            }
            return false;
        };
        HashDescriptor.prototype.changedTerminalReference = function (models, protos) {
            for (var key in protos) {
                if (key in models) {
                    var model = models[key];
                    var proto = protos[key];
                    if (model && proto) {
                        if (models[key].$rid !== protos[key]) {
                            return true;
                        }
                    }
                    else if (model || proto || model !== proto) {
                        return true;
                    }
                }
                else {
                    return true;
                }
            }
            for (var key in models) {
                if (!(key in protos)) {
                    return true;
                }
            }
            return false;
        };
        HashDescriptor.prototype.containsCollection = function (collections, query, cache) {
            var of = this.of;
            for (var i in collection) {
                var collection = collections[i];
                if (collection && of.contains(collection, query, cache))
                    return true;
            }
            return false;
        };
        HashDescriptor.prototype.containsTerminalAtom = function (models, query, cache) {
            for (var i in models) {
                var atom = models[i];
                if (atom && query(atom))
                    return true;
            }
            return false;
        };
        HashDescriptor.prototype.containsTerminalReference = function (references, query, cache) {
            var of = this.of.of;
            for (var i in references) {
                var reference = references[i];
                if (reference && of.contains(reference, query, cache))
                    return true;
            }
            return false;
        };
        HashDescriptor.prototype.dereferenceCollection = function (models) {
            var of = this.of;
            var result = {};
            for (var key in models) {
                var model = models[key];
                if (model) {
                    result[key] = of.dereference(model);
                }
                else {
                    result[key] = model;
                }
            }
            return result;
        };
        HashDescriptor.prototype.dereferenceTerminalAtom = function (models) {
            var result = {};
            for (var key in models) {
                result[key] = models[key];
            }
            return result;
        };
        HashDescriptor.prototype.dereferenceTerminalReference = function (models) {
            var result = {};
            for (var key in models) {
                var model = models[key];
                if (model) {
                    result[key] = model.$rid;
                }
                else {
                    result[key] = model;
                }
            }
            return result;
        };
        return HashDescriptor;
    })(CollectionDescriptor);
    Reflex.HashDescriptor = HashDescriptor;
    var TerminalDescriptor = (function (_super) {
        __extends(TerminalDescriptor, _super);
        function TerminalDescriptor(repo, tableDescriptor, propertyDescriptor, type) {
            _super.call(this, repo, tableDescriptor, propertyDescriptor, type);
        }
        return TerminalDescriptor;
    })(TypeDescriptor);
    Reflex.TerminalDescriptor = TerminalDescriptor;
    var AtomDescriptor = (function (_super) {
        __extends(AtomDescriptor, _super);
        function AtomDescriptor(repo, tableDescriptor, propertyDescriptor, indexConfiguration) {
            _super.call(this, repo, tableDescriptor, propertyDescriptor, 0 /* Atom */);
            this._index = new Reflex.Index(indexConfiguration);
        }
        AtomDescriptor.prototype.export = function (version, model) {
            if (version) {
                var typeString = toString.call(version);
                if (typeString === '[object Object]' || typeString === '[object Array]') {
                    return JSON.parse(JSON.stringify(version));
                }
            }
            return version;
        };
        AtomDescriptor.prototype.import = function (version, model) {
            if (model) {
                var typeString = toString.call(version);
                if (typeString === '[object Object]' || typeString === '[object Array]') {
                    return JSON.parse(JSON.stringify(model));
                }
            }
            return model;
        };
        AtomDescriptor.prototype.index = function (reference, $vid, value) {
            this._index.add(reference, $vid, value);
        };
        AtomDescriptor.prototype.deindex = function ($vid) {
            this._index.remove($vid);
        };
        AtomDescriptor.prototype.intersect = function (query, intersection, fn) {
            return this._index.intersect(query, intersection, function (score, document) {
                return fn({
                    score: score,
                    value: document.$value,
                    $vid: document.$vid,
                    reference: document.$reference
                });
            });
        };
        return AtomDescriptor;
    })(TerminalDescriptor);
    Reflex.AtomDescriptor = AtomDescriptor;
    var ReferenceDescriptor = (function (_super) {
        __extends(ReferenceDescriptor, _super);
        function ReferenceDescriptor(repo, tableDescriptor, propertyDescriptor, of) {
            _super.call(this, repo, tableDescriptor, propertyDescriptor, 3 /* Reference */);
            this.of = of;
        }
        ReferenceDescriptor.prototype.recursiveSearchToken = function (token, cache) {
            return this.of.recursiveSearchToken(token, cache);
        };
        ReferenceDescriptor.prototype.export = function (reference, model) {
            if (reference) {
                return reference.$rid;
            }
            return reference;
        };
        ReferenceDescriptor.prototype.import = function (version, reference) {
            if (reference) {
                var repo = this.repo;
                var tableDescriptor = this.of;
                var $table = tableDescriptor.name;
                var $rid = reference instanceof Reference ? reference.$rid : reference;
                // // Old implementation:
                // for (var iterator = repo; !!iterator; iterator = iterator.parent) {
                //     var result = iterator.tables[$table][$rid];
                //     if (result) {
                //         if (iterator !== repo) { // This means that such refrence is found in one of parent repositories but it not exists in local one
                //             var diff = iterator.checkout($rid); // Then it has to be added
                //             repo.merge(diff);
                //             result = repo.tables[$table][$rid];
                //         }
                //         return result;
                //     }
                // }
                return repo.tables[$table][$rid] || Throw('Reference "' + $rid + '" not found');
            }
            return reference;
        };
        return ReferenceDescriptor;
    })(TerminalDescriptor);
    Reflex.ReferenceDescriptor = ReferenceDescriptor;
    var PropertyDescriptor = (function () {
        function PropertyDescriptor(repo, parent, name, typeDeclaration, descriptorCache) {
            this.repo = repo;
            this.parent = parent;
            this.name = name;
            this.typeDescriptor = TypeDescriptor.fromRecord(repo, parent, this, typeDeclaration, descriptorCache);
        }
        PropertyDescriptor.prototype.index = function (reference, $vid, value) {
            this.typeDescriptor.index(reference, $vid, value);
        };
        PropertyDescriptor.prototype.deindex = function ($vid) {
            this.typeDescriptor.deindex($vid);
        };
        PropertyDescriptor.prototype.intersect = function (query, intersection, fn) {
            return this.typeDescriptor.intersect(query, intersection, fn);
        };
        PropertyDescriptor.prototype.export = function (version, model) {
            return this.typeDescriptor.export(version, model);
        };
        PropertyDescriptor.prototype.import = function (version, model) {
            return this.typeDescriptor.import(version, model);
        };
        return PropertyDescriptor;
    })();
    Reflex.PropertyDescriptor = PropertyDescriptor;
    var TableDescriptor = (function () {
        function TableDescriptor(repo, name, declaration) {
            this.repo = repo;
            this.name = name;
            this.declaration = declaration;
            this.properties = {};
            this.propertiesArray = [];
            this.atomProperties = [];
            this.referenceProperties = [];
            this.flatProperties = [];
            this.nestedProperties = [];
            this.hashProperties = [];
            this.arrayProperties = [];
            this.nestedAtomProperties = [];
            this.nestedReferenceProperties = [];
            this.flatAtomProperties = [];
            this.flatReferenceProperties = [];
        }
        TableDescriptor.prototype.flatSearch = function (query) {
            var tokens = query.match(/(?:")(?:(?:[\u00C0-\u1FFF\u2C00-\uD7FF\w]+'[\u00C0-\u1FFF\u2C00-\uD7FF\w]+|['\u00C0-\u1FFF\u2C00-\uD7FF\w]+)[^\u00C0-\u1FFF\u2C00-\uD7FF\w]*)+(?:")|(?:[\u00C0-\u1FFF\u2C00-\uD7FF\w]+'[\u00C0-\u1FFF\u2C00-\uD7FF\w]+|['\u00C0-\u1FFF\u2C00-\uD7FF\w]+)/g) || emptyList;
            var properties = this.flatAtomProperties;
            var propertiesLength = properties.length;
            var count = 0, intersectionA = null, tokensLength = tokens.length;
            for (var tokenIndex = 0; tokenIndex < tokens.length; tokenIndex++) {
                var token = tokens[tokenIndex], intersectionB = {}, count = 0;
                for (var propertyIndex = 0; propertyIndex < propertiesLength; propertyIndex++) {
                    properties[propertyIndex].intersect(token, intersectionA, function (searchResult) {
                        var searchResultCache = intersectionB[searchResult.$vid];
                        if (searchResultCache) {
                            var score = searchResultCache.score;
                            searchResultCache.score += score * score;
                        }
                        else {
                            count++;
                            intersectionB[searchResultCache.$vid] = searchResult;
                            searchResult.score *= searchResult.score;
                        }
                    });
                }
                intersectionA = intersectionB;
            }
            return {
                count: count,
                results: intersectionA || {}
            };
        };
        TableDescriptor.prototype.recursiveSearchToken = function (token, cache) {
            var repo = this.repo;
            var $table = this.name;
            var results = cache[$table];
            var count = 0;
            var records = repo.records;
            var referenecs = repo.references;
            if (!results) {
                results = cache[this.name] = {};
                var propertiesCollection = [this.flatReferenceProperties, this.nestedReferenceProperties];
                for (var propertiesCollectionIndex = 0; propertiesCollectionIndex < propertiesCollection.length; propertiesCollectionIndex++) {
                    var properties = propertiesCollection[propertiesCollectionIndex];
                    var propertiesLength = properties.length;
                    for (var propertyIndex = 0; propertyIndex < properties.length; propertyIndex++) {
                        var property = properties[propertyIndex];
                        var propertyName = property.name;
                        var searchResults = property.typeDescriptor.recursiveSearchToken(token, cache).results;
                        for (var $vid in searchResults) {
                            var searchResult = searchResults[$vid];
                            var ownersByTable = searchResult.reference.owners[$table];
                            if (ownersByTable) {
                                var ownersByTableByProperty = ownersByTable[propertyName];
                                if (ownersByTableByProperty) {
                                    for (var ownerVersion in ownersByTableByProperty) {
                                        var result = results[ownerVersion];
                                        if (result) {
                                            result.score += searchResult.score;
                                        }
                                        else {
                                            count++;
                                            results[ownerVersion] = {
                                                score: searchResult.score,
                                                value: searchResult.value,
                                                reference: referenecs[records[ownerVersion].rid],
                                                $vid: ownerVersion
                                            };
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                var propertiesCollection = [this.flatAtomProperties, this.nestedAtomProperties];
                for (var propertiesCollectionIndex = 0; propertiesCollectionIndex < propertiesCollection.length; propertiesCollectionIndex++) {
                    var properties = propertiesCollection[propertiesCollectionIndex];
                    var propertiesLength = properties.length;
                    for (var propertyIndex = 0; propertyIndex < propertiesLength; propertyIndex++) {
                        var property = properties[propertyIndex];
                        var propertyName = property.name;
                        property.intersect(token, null, function (searchResult) {
                            var existingSearchResult = results[searchResult.$vid];
                            if (existingSearchResult) {
                                existingSearchResult.score += searchResult.score * searchResult.score;
                            }
                            else {
                                count++;
                                results[searchResult.$vid] = searchResult;
                                searchResult.score *= searchResult.score;
                            }
                        });
                    }
                }
            }
            return {
                count: count,
                results: results
            };
        };
        TableDescriptor.prototype.recursiveSearch = function (query) {
            var tokens = query.match(/(?:")(?:(?:[\u00C0-\u1FFF\u2C00-\uD7FF\w]+'[\u00C0-\u1FFF\u2C00-\uD7FF\w]+|['\u00C0-\u1FFF\u2C00-\uD7FF\w]+)[^\u00C0-\u1FFF\u2C00-\uD7FF\w]*)+(?:")|(?:[\u00C0-\u1FFF\u2C00-\uD7FF\w]+'[\u00C0-\u1FFF\u2C00-\uD7FF\w]+|['\u00C0-\u1FFF\u2C00-\uD7FF\w]+)/g) || emptyList;
            var tokensLength = tokens.length;
            if (tokensLength > 0) {
                var searchResultsA = this.recursiveSearchToken(tokens[0], {});
                for (var tokenIndex = 1; tokenIndex < tokens.length; tokenIndex++) {
                    var searchResultsB = this.recursiveSearchToken(tokens[tokenIndex], {});
                    if (searchResultsA.count < searchResultsB.count) {
                        var intersectionA = searchResultsA.results;
                        var intersectionB = searchResultsB.results;
                    }
                    else {
                        var intersectionA = searchResultsB.results;
                        var intersectionB = searchResultsA.results;
                    }
                    var intersectionC = {};
                    var count = 0;
                    for (var $vid in intersectionA) {
                        var searchResult = intersectionB[$vid];
                        if (searchResult) {
                            count++;
                            intersectionC[$vid] = searchResult;
                        }
                    }
                    searchResultsA = {
                        count: count,
                        results: intersectionC
                    };
                }
                return searchResultsA;
            }
            return {
                count: 0,
                results: {}
            };
        };
        TableDescriptor.prototype.initializeDeclaration = function (repo, propertyName, propertyDeclaration, descriptorCache) {
            var propertyDescriptor = new PropertyDescriptor(repo, this, propertyName, propertyDeclaration, descriptorCache);
            this.propertiesArray.push(propertyDescriptor);
            this.properties[propertyDescriptor.name] = propertyDescriptor;
            var typeDescriptor = propertyDescriptor.typeDescriptor;
            switch (typeDescriptor.type) {
                case 0 /* Atom */:
                    this.atomProperties.push(propertyDescriptor);
                    this.flatProperties.push(propertyDescriptor);
                    this.flatAtomProperties.push(propertyDescriptor);
                    break;
                case 1 /* Hash */:
                    this.hashProperties.push(propertyDescriptor);
                    this.nestedProperties.push(propertyDescriptor);
                    var baseTypeDescriptor = typeDescriptor.baseType;
                    switch (baseTypeDescriptor.type) {
                        case 0 /* Atom */:
                            this.atomProperties.push(propertyDescriptor);
                            this.nestedAtomProperties.push(propertyDescriptor);
                            break;
                        case 3 /* Reference */:
                            this.referenceProperties.push(propertyDescriptor);
                            this.nestedReferenceProperties.push(propertyDescriptor);
                            break;
                    }
                    break;
                case 2 /* Array */:
                    this.arrayProperties.push(propertyDescriptor);
                    this.nestedProperties.push(propertyDescriptor);
                    var baseTypeDescriptor = typeDescriptor.baseType;
                    switch (baseTypeDescriptor.type) {
                        case 0 /* Atom */:
                            this.atomProperties.push(propertyDescriptor);
                            this.nestedAtomProperties.push(propertyDescriptor);
                            break;
                        case 3 /* Reference */:
                            this.referenceProperties.push(propertyDescriptor);
                            this.nestedReferenceProperties.push(propertyDescriptor);
                            break;
                    }
                    break;
                case 3 /* Reference */:
                    this.flatProperties.push(propertyDescriptor);
                    this.flatReferenceProperties.push(propertyDescriptor);
                    this.referenceProperties.push(propertyDescriptor);
                    break;
                default:
                    ThrowInvalidOperationException();
            }
        };
        TableDescriptor.prototype.initialize = function (descriptorCache) {
            var declaration = this.declaration;
            for (var propertyName in declaration) {
                this.initializeDeclaration(this.repo, propertyName, declaration[propertyName], descriptorCache);
            }
        };
        TableDescriptor.prototype.reference = function (references, ownerRecord, model) {
            var $rid = ownerRecord.rid;
            var $vid = ownerRecord.vid;
            var $table = ownerRecord.table;
            var reference = references[$rid];
            var properties = this.flatAtomProperties;
            var count = properties.length;
            for (var i = 0; i < count; i++) {
                var property = properties[i];
                var value = model[property.name];
                if (value !== null && value !== void 0) {
                    property.index(reference, $vid, value);
                }
            }
            var properties = this.flatReferenceProperties;
            var count = properties.length;
            for (var i = 0; i < count; i++) {
                var property = properties[i];
                var propertyName = property.name;
                var referenceString = model[property.name];
                if (referenceString) {
                    var reference = model[propertyName] = (references[referenceString] || (references[referenceString] = new Reference(this.repo, referenceString, property.typeDescriptor.of.name)));
                    var ownerProperties = reference.owners[$table] || (reference.owners[$table] = {});
                    var ownerTable = ownerProperties[propertyName] || (ownerProperties[propertyName] = {});
                    ownerTable[$vid] = model;
                }
            }
            var properties = this.nestedReferenceProperties;
            var count = properties.length;
            for (var i = 0; i < count; i++) {
                var property = properties[i];
                var referenceCollection = model[property.name];
                if (referenceCollection) {
                    property.typeDescriptor.reference(references, ownerRecord, model, referenceCollection);
                }
            }
        };
        TableDescriptor.prototype.cleanup = function (references, record, model) {
            var $vid = record.vid;
            var $table = record.table;
            properties = this.flatReferenceProperties;
            count = properties.length;
            for (var i = 0; i < count; i++) {
                var property = properties[i];
                var propertyName = property.name;
                var reference = model[property.name];
                if (reference) {
                    var ownerProperties = reference.owners[$table];
                    if (ownerProperties) {
                        var table = ownerProperties[propertyName];
                        if (table) {
                            delete table[$vid];
                            if (isEmpty(table)) {
                                delete ownerProperties[propertyName];
                                if (isEmpty(ownerProperties)) {
                                    delete reference.owners[$table];
                                }
                            }
                        }
                        else {
                            if (isEmpty(ownerProperties)) {
                                delete reference.owners[$table];
                            }
                        }
                    }
                }
            }
            var properties = this.nestedReferenceProperties;
            var count = properties.length;
            for (var i = 0; i < count; i++) {
                var property = properties[i];
                var referenceCollection = model[property.name];
                if (referenceCollection) {
                    property.typeDescriptor.cleanup(references, record, referenceCollection);
                }
            }
            var properties = this.flatAtomProperties;
            var count = properties.length;
            for (var i = 0; i < count; i++) {
                var property = properties[i];
                property.deindex($vid);
            }
        };
        TableDescriptor.prototype.checkout = function (records, model, cache, result) {
            var properties = this.flatReferenceProperties;
            var length = properties.length;
            for (var i = 0; i < length; i++) {
                var property = properties[i];
                var propertyValue = model[property.name];
                if (propertyValue) {
                    var versions = propertyValue.versions;
                    for (var $vid in versions) {
                        if (!($vid in cache)) {
                            result.push(records[$vid]);
                            cache[$vid] = versions[$vid];
                        }
                    }
                }
            }
            var properties = this.nestedReferenceProperties;
            var length = properties.length;
            for (var i = 0; i < length; i++) {
                var property = properties[i];
                var propertyValue = model[property.name];
                if (propertyValue) {
                    property.typeDescriptor.checkout(records, propertyValue, cache, result);
                }
            }
        };
        TableDescriptor.prototype.contains = function (reference, query, cache) {
            if (reference && !(reference.$rid in cache)) {
                var result = false;
                var versions = reference.versions;
                cache[reference.$rid] = null;
                for (var $vid in versions) {
                    var version = versions[$vid];
                    var properties = this.flatAtomProperties;
                    var propertiesLength = properties.length;
                    for (var i = 0; i < propertiesLength; i++) {
                        var property = properties[i];
                        var propertyName = property.name;
                        if (propertyName in version) {
                            if (query(version[propertyName]))
                                return cache[reference.$rid] = true;
                        }
                    }
                    properties = this.flatReferenceProperties;
                    propertiesLength = properties.length;
                    for (var i = 0; i < propertiesLength; i++) {
                        var property = properties[i];
                        var propertyName = property.name;
                        if (propertyName in version) {
                            if (property.typeDescriptor.of.contains(version[propertyName], query, cache))
                                return cache[reference.$rid] = true;
                        }
                    }
                    properties = this.nestedProperties;
                    propertiesLength = properties.length;
                    for (var i = 0; i < propertiesLength; i++) {
                        var property = properties[i];
                        var propertyName = property.name;
                        if (propertyName in version) {
                            if (property.typeDescriptor.contains(version[propertyName], query, cache))
                                return cache[reference.$rid] = true;
                        }
                    }
                }
            }
            return cache[reference.$rid] = false;
        };
        TableDescriptor.prototype.clone = function (record, reference) {
            var proto = record.proto;
            var result = new Version(record.vid, record.cid, reference.$rid, reference);
            var properties = this.flatProperties;
            var length = properties.length;
            for (var i = 0; i < length; i++) {
                var property = properties[i];
                var propertyName = property.name;
                if (propertyName in proto) {
                    result[propertyName] = proto[propertyName];
                }
            }
            var properties = this.nestedProperties;
            var length = properties.length;
            for (var i = 0; i < length; i++) {
                var property = properties[i];
                var propertyName = property.name;
                if (propertyName in proto) {
                    var propertyValue = proto[propertyName];
                    if (propertyValue) {
                        result[propertyName] = property.typeDescriptor.clone(propertyValue);
                    }
                    else {
                        result[propertyName] = propertyValue;
                    }
                }
            }
            return result;
        };
        TableDescriptor.prototype.changed = function (model, proto) {
            var properties = this.flatAtomProperties;
            var length = properties.length;
            for (var i = 0; i < length; i++) {
                var property = properties[i];
                var propertyName = property.name;
                if ((propertyName in proto) !== (propertyName in model) || proto[propertyName] !== model[propertyName]) {
                    return true;
                }
            }
            var properties = this.flatReferenceProperties;
            var length = properties.length;
            for (var i = 0; i < length; i++) {
                var property = properties[i];
                var propertyName = property.name;
                var inModel = propertyName in model;
                var inProto = propertyName in proto;
                if (inModel && inProto) {
                    var modelValue = model[propertyName];
                    if (modelValue) {
                        if (model[propertyName].$rid !== proto[propertyName]) {
                            return true;
                        }
                    }
                    else if (modelValue !== proto[propertyName]) {
                        return true;
                    }
                }
                else if (inModel || inProto) {
                    return true;
                }
            }
            var properties = this.nestedProperties;
            var length = properties.length;
            for (var i = 0; i < length; i++) {
                var property = properties[i];
                var propertyName = property.name;
                var inModel = propertyName in model;
                var inProto = propertyName in proto;
                if (inModel && inProto) {
                    var modelValue = model[propertyName];
                    var protoValue = proto[propertyName];
                    if (modelValue && protoValue) {
                        if (property.typeDescriptor.changed(modelValue, protoValue)) {
                            return true;
                        }
                    }
                    else if (modelValue || protoValue || modelValue !== protoValue) {
                        return true;
                    }
                }
                else if (inModel || inProto) {
                    return true;
                }
            }
            return false;
        };
        TableDescriptor.prototype.dereference = function (model) {
            var result = {};
            var properties = this.flatAtomProperties;
            var length = properties.length;
            for (var i = 0; i < length; i++) {
                var property = properties[i];
                var propertyName = property.name;
                if (propertyName in model) {
                    result[propertyName] = model[propertyName];
                }
            }
            var properties = this.flatReferenceProperties;
            var length = properties.length;
            for (var i = 0; i < length; i++) {
                var property = properties[i];
                var propertyName = property.name;
                if (propertyName in model) {
                    var modelValue = model[propertyName];
                    if (modelValue) {
                        result[propertyName] = modelValue.$rid;
                    }
                    else {
                        result[propertyName] = modelValue;
                    }
                }
            }
            var properties = this.nestedProperties;
            var length = properties.length;
            for (var i = 0; i < length; i++) {
                var property = properties[i];
                var propertyName = property.name;
                if (propertyName in model) {
                    var propertyValue = model[propertyName];
                    if (propertyValue) {
                        result[propertyName] = property.typeDescriptor.dereference(propertyValue);
                    }
                    else {
                        result[propertyName] = propertyValue;
                    }
                }
            }
            return result;
        };
        return TableDescriptor;
    })();
    Reflex.TableDescriptor = TableDescriptor;
    var Pipeline = (function () {
        function Pipeline() {
        }
        Pipeline.defaultStopWordsFilter = function (stopWords) {
            return function (tokens) {
                var count = tokens.length;
                for (var index = 0, capacity = 0; index < count; index++) {
                    var token = tokens[index];
                    if (!(token in stopWords)) {
                        tokens[capacity++] = token;
                    }
                }
                tokens.length = capacity;
                return tokens;
            };
        };
        Pipeline.defaultTokenizer = function (regexp) {
            return function (value) {
                return String(value).toLowerCase().match(regexp) || emptyList;
            };
        };
        Pipeline.defaultStemmer = function (stemmer) {
            return function (tokens) {
                var count = tokens.length;
                for (var index = 0; index < count; index++) {
                    tokens[index] = stemmer(tokens[index]);
                }
                return tokens;
            };
        };
        Pipeline.defaultStopWords = (function (array) {
            var result = {};
            for (var i = 0; i < array.length; ++i)
                result[array[i]] = true;
            return result;
        })(["a", "about", "above", "across", "after", "afterwards", "again", "against", "all", "almost", "alone", "along", "already", "also", "although", "always", "am", "among", "amongst", "amoungst", "amount", "an", "and", "another", "any", "anyhow", "anyone", "anything", "anyway", "anywhere", "are", "around", "as", "at", "back", "be", "became", "because", "become", "becomes", "becoming", "been", "before", "beforehand", "behind", "being", "below", "beside", "besides", "between", "beyond", "bill", "both", "bottom", "but", "by", "call", "can", "cannot", "cant", "co", "con", "could", "couldnt", "cry", "de", "describe", "detail", "do", "done", "down", "due", "during", "each", "eg", "eight", "either", "eleven", "else", "elsewhere", "empty", "enough", "etc", "even", "ever", "every", "everyone", "everything", "everywhere", "except", "few", "fifteen", "fify", "fill", "find", "fire", "first", "five", "for", "former", "formerly", "forty", "found", "four", "from", "front", "full", "further", "get", "give", "go", "had", "has", "hasnt", "have", "he", "hence", "her", "here", "hereafter", "hereby", "herein", "hereupon", "hers", "herself", "him", "himself", "his", "how", "however", "hundred", "ie", "if", "in", "inc", "indeed", "interest", "into", "is", "it", "its", "itself", "keep", "last", "latter", "latterly", "least", "less", "ltd", "made", "many", "may", "me", "meanwhile", "might", "mill", "mine", "more", "moreover", "most", "mostly", "move", "much", "must", "my", "myself", "name", "namely", "neither", "never", "nevertheless", "next", "nine", "no", "nobody", "none", "noone", "nor", "not", "nothing", "now", "nowhere", "of", "off", "often", "on", "once", "one", "only", "onto", "or", "other", "others", "otherwise", "our", "ours", "ourselves", "out", "over", "own", "part", "per", "perhaps", "please", "put", "rather", "re", "same", "see", "seem", "seemed", "seeming", "seems", "serious", "several", "she", "should", "show", "side", "since", "sincere", "six", "sixty", "so", "some", "somehow", "someone", "something", "sometime", "sometimes", "somewhere", "still", "such", "system", "take", "ten", "than", "that", "their", "them", "themselves", "then", "thence", "there", "thereafter", "thereby", "therefore", "therein", "thereupon", "these", "they", "thickv", "thin", "third", "this", "those", "though", "three", "through", "throughout", "thru", "thus", "to", "together", "too", "top", "toward", "towards", "twelve", "twenty", "two", "un", "under", "until", "up", "upon", "us", "very", "via", "was", "we", "well", "were", "what", "whatever", "when", "whence", "whenever", "where", "whereafter", "whereas", "whereby", "wherein", "whereupon", "wherever", "whether", "which", "while", "whither", "who", "whoever", "whole", "whom", "whose", "why", "will", "with", "within", "without", "would", "yet", "you", "your", "yours", "yourself", "yourselves", "the"]);
        Pipeline.defaultTokenizerRegexp = /[\u00C0-\u1FFF\u2C00-\uD7FF\w]+'[\u00C0-\u1FFF\u2C00-\uD7FF\w]+|['\u00C0-\u1FFF\u2C00-\uD7FF\w]+/ig;
        return Pipeline;
    })();
    Reflex.Pipeline = Pipeline;
    var Repo = (function () {
        function Repo(declarations, defaultIndexConfiguration, indexConfigurations) {
            this.defaultIndexConfiguration = defaultIndexConfiguration;
            this.indexConfigurations = indexConfigurations;
            var me = this;
            me.indexConfigurations = me.indexConfigurations || {};
            me.defaultIndexConfiguration = me.defaultIndexConfiguration || 'default';
            me.indexConfigurations[me.defaultIndexConfiguration] = me.indexConfigurations[me.defaultIndexConfiguration] || (function () {
                return {
                    insertPipeline: [Pipeline.defaultTokenizer(Pipeline.defaultTokenizerRegexp)],
                    searchPipeline: [Pipeline.defaultTokenizer(Pipeline.defaultTokenizerRegexp)]
                };
            })();
            me.tables = {};
            me.records = {};
            me.creates = {};
            me.deletes = {};
            me.versions = {};
            me.references = {};
            me.tableChanged = {};
            me.tableChanging = {};
            me.referenceChanged = {};
            me.referenceChanging = {};
            if (declarations)
                me.migrate(declarations);
        }
        Repo.prototype.search = function (query, $table, propertyName) {
            var results;
            if (arguments.length) {
                if (arguments.length === 1) {
                    var searchResultsCount = 0;
                    var searchResults = {};
                    var descriptors = this.descriptors;
                    for (var tableDescriptorName in descriptors) {
                        var tableDescriptor = descriptors[tableDescriptorName];
                        var union = tableDescriptor.recursiveSearch(query).results;
                        for (var $vid in union) {
                            var value = union[$vid];
                            var searchResult = searchResults[$vid];
                            if (searchResult) {
                                searchResult.score += value.score;
                            }
                            else {
                                searchResultsCount++;
                                searchResults[$vid] = value;
                            }
                        }
                    }
                    results = {
                        count: searchResultsCount,
                        results: searchResults
                    };
                }
                else if (arguments.length === 2) {
                    results = this.descriptors[$table].recursiveSearch(query);
                }
                else {
                    var searchResultsCount = 0;
                    var searchResults = {};
                    var property = this.descriptors[$table].properties[propertyName];
                    var typeDescriptor = property.typeDescriptor;
                    var baseTypeDescriptor = typeDescriptor instanceof CollectionDescriptor ? typeDescriptor.baseType : typeDescriptor;
                    if (baseTypeDescriptor.type === 0 /* Atom */) {
                        property.intersect(query, null, function (searchResult) {
                            searchResultsCount++;
                            searchResults[searchResult.$vid] = searchResult;
                        });
                    }
                    else if (baseTypeDescriptor.type === 3 /* Reference */) {
                        results = baseTypeDescriptor.of.recursiveSearch(query);
                    }
                    results = {
                        count: searchResultsCount,
                        results: searchResults
                    };
                }
            }
            else {
                results = {
                    count: 0,
                    results: {}
                };
            }
            var index = 0;
            var result = [];
            var resultsHash = results.results;
            result.length = results.count;
            for (var key in resultsHash) {
                result[index++] = resultsHash[key];
            }
            result.sort(function (a, b) {
                return b.score - a.score;
            });
            return result;
        };
        Repo.prototype.find = function (references, $table, query, itemCallback, cache) {
            if (references) {
                var table = this.descriptor($table);
                cache = cache || {};
                if (toString.call(references) === '[object Array]') {
                    var length = references.length;
                    for (var i = 0; i < length; i++) {
                        var reference = references[i];
                        itemCallback(reference, table.contains(reference, query, cache));
                    }
                }
                else {
                    for (var key in references) {
                        var reference = references[key];
                        itemCallback(reference, table.contains(reference, query, cache));
                    }
                }
            }
        };
        Repo.prototype.descriptor = function (name) {
            return this.descriptors[name] || Throw('Descriptor "' + name + '" not found');
        };
        Repo.prototype.checkout = function (idsOrVersionsOrReferences) {
            var cache = {};
            var result = [];
            var records = this.records;
            var references = this.references;
            var tableDescriptors = this.descriptors;
            var preprocessReference = function (reference) {
                var versions = reference.versions;
                for (var $vid in versions) {
                    if (!($vid in cache)) {
                        result.push(records[$vid]);
                        cache[$vid] = versions[$vid];
                    }
                }
            };
            var preprocessArguments = function () {
                foreach(arguments, function (argument) {
                    if (argument instanceof Reference) {
                        preprocessReference(argument);
                    }
                    else if (argument instanceof Version) {
                        var $vid = argument.$vid;
                        if (!($vid in cache)) {
                            result.push(records[$vid]);
                            cache[$vid] = argument;
                        }
                    }
                    else if (typeof argument == 'string' || argument instanceof String) {
                        if (argument in records) {
                            if (!(argument in cache)) {
                                var record = records[argument];
                                result.push(record);
                                cache[argument] = references[record.rid].versions[record.vid];
                            }
                        }
                        else if (argument in references) {
                            preprocessReference(references[argument]);
                        }
                        else {
                            Throw('Id "' + argument + '" not found');
                        }
                    }
                    else if (toString.call(argument) === '[object Array]') {
                        preprocessArguments.apply(this, argument);
                    }
                    else if (toString.call(argument) === '[object Object]') {
                        foreach(argument, function (nested) {
                            preprocessArguments.call(this, nested);
                        });
                    }
                    else {
                        Throw('Unexpected argument type');
                    }
                });
            };
            preprocessArguments.apply(this, arguments);
            for (var i = 0; i < result.length; i++) {
                var record = result[i];
                tableDescriptors[record.table].checkout(records, cache[record.vid], cache, result);
            }
            return result;
        };
        Repo.prototype.diff = function () {
            var creates = this.creates;
            var deletes = this.deletes;
            var records = this.records;
            var references = this.references;
            var tableDescriptors = this.descriptors;
            var results = [];
            for (var $vid in records) {
                var record = records[$vid];
                var reference = references[record.rid];
                var versions = reference.versions;
                var table = record.table;
                var inCreates = $vid in creates;
                var inDeletes = $vid in deletes;
                if (!(inCreates && inDeletes) && (inCreates || inDeletes || tableDescriptors[table].changed(versions[$vid], record.proto))) {
                    // This statement will get executed only when version not in creates and deletes simultaneously
                    if (inDeletes) {
                        results.push({
                            rid: record.rid,
                            vid: inCreates ? null : record.vid,
                            table: record.table,
                            pid: record.pid,
                            createdOn: record.createdOn,
                            updatedOn: record.updatedOn
                        });
                    }
                    else {
                        results.push({
                            cid: record.cid,
                            rid: record.rid,
                            vid: inCreates ? null : record.vid,
                            table: record.table,
                            pid: record.pid,
                            proto: tableDescriptors[record.table].dereference(versions[$vid]),
                            createdOn: record.createdOn,
                            updatedOn: record.updatedOn,
                            recoveredOn: record.recoveredOn
                        });
                    }
                }
            }
            return results;
        };
        Repo.fireTableEvents = function (tableDescriptor, eventHandlersHash) {
            var $table = tableDescriptor.name;
            var eventHandlers = eventHandlersHash[$table];
            if (eventHandlers) {
                var length = eventHandlers.length;
                for (var i = 0; i < length; i++) {
                    eventHandlers[i]($table, tableDescriptor);
                }
            }
        };
        Repo.prototype.merge = function (items) {
            var tables = this.tables;
            var records = this.records;
            var versions = this.versions;
            var references = this.references;
            var tableDescriptors = this.descriptors;
            var tableChanged = this.tableChanged;
            var tableChanging = this.tableChanging;
            var referenceChanged = this.referenceChanged;
            var referenceChanging = this.referenceChanging;
            var changedTables = {};
            var changedReferences = {};
            var length = items.length;
            for (var i = 0; i < length; i++) {
                var record = items[i];
                var $rid = record.rid;
                var table = record.table;
                var reference = references[$rid];
                var tableDescriptor = tableDescriptors[table];
                if (tableDescriptor) {
                    // table changing event handling logic
                    if (!(table in changedTables)) {
                        Repo.fireTableEvents(changedTables[table] = tableDescriptor, tableChanging);
                    }
                    // If there is subscription to referenceChanging event for this reference, then add it to a list
                    var callbacks = referenceChanging[$rid];
                    if (callbacks) {
                        var callbacksLength = callbacks.length;
                        for (var callbackIndex = 0; callbackIndex < callbacksLength; callbackIndex++) {
                            callbacks[callbackIndex]($rid, reference, tableDescriptor, record);
                        }
                    }
                    if (record.proto) {
                        var $vid = record.vid;
                        var reference = references[$rid];
                        if (reference) {
                            reference.versions[$vid] = tableDescriptor.clone(record, reference);
                        }
                        else {
                            reference = tables[table][$rid] = references[$rid] = new Reference(this, $rid, record.table);
                            versions[$vid] = reference.versions[$vid] = tableDescriptor.clone(record, reference);
                        }
                        records[$vid] = record;
                    }
                    // If there is subscription to referenceChanged event for this reference, then add it to a list
                    if ($rid in referenceChanged) {
                        changedReferences[$rid] = tableDescriptor;
                    }
                }
                else {
                    Throw('Table "' + table + '" not found');
                }
            }
            for (var i = 0; i < length; i++) {
                var record = items[i];
                if (record.proto) {
                    tableDescriptors[record.table].reference(references, record, references[record.rid].versions[record.vid]);
                }
                else {
                    var record = items[i];
                    var $rid = record.rid;
                    var $vid = record.vid;
                    delete records[$vid];
                    var reference = references[$rid];
                    if (reference) {
                        var version = reference.versions[$vid];
                        delete versions[$vid];
                        delete reference.versions[$vid];
                        // Test whether the object is being referenced by other objects
                        if (isEmpty(reference.owners) && isEmpty(reference.versions)) {
                            delete references[$rid];
                            delete tables[record.table][$rid];
                        }
                        tableDescriptors[record.table].cleanup(references, record, version);
                    }
                }
            }
            for (var key in changedReferences) {
                var tableDescriptor = changedReferences[key];
                var referenceChangedCallbacks = referenceChanged[key];
                var referenceChangedCallbacksLength = referenceChangedCallbacks.length;
                for (var i = 0; i < referenceChangedCallbacksLength; i++) {
                    referenceChangedCallbacks[i](key, references[key], tableDescriptor); // references[key] may be undefined
                }
            }
            for (var key in changedTables) {
                Repo.fireTableEvents(changedTables[key], tableChanged);
            }
        };
        Repo.prototype.migrate = function (declarations) {
            var self = this;
            var descriptors = this.descriptors = {};
            var descriptorCache = {};
            var descriptorCacheFn = function (name) {
                var declaration = name;
                while (toString.call(declaration) === '[object String]') {
                    declaration = declarations[declaration] || Throw('Descriptor "' + declaration + '" not found');
                    if (declaration === name) {
                        Throw('Recursive type declaration of type "' + name + '"');
                    }
                }
                if (name in descriptorCache) {
                    return descriptorCache[name];
                }
                else {
                    var descriptor = descriptorCache[name] = new TableDescriptor(self, name, declaration);
                    descriptor.initialize(descriptorCacheFn);
                    return descriptor;
                }
            };
            for (var $table in declarations) {
                descriptors[$table] = descriptorCacheFn($table);
            }
            var tables = this.tables;
            for (var $table in declarations) {
                tables[$table] = tables[$table] || {};
            }
            this.declarations = declarations;
        };
        Repo.prototype.createVersion = function (reference, $vid, $pid, model) {
            if (reference) {
                var now = (new Date()).getTime();
                var record = this.records[$vid] = {
                    vid: $vid,
                    rid: reference.$rid,
                    table: reference.table,
                    pid: $pid,
                    proto: null,
                    createdOn: now,
                    updatedOn: now
                };
                var version = this.creates[$vid] = reference.versions[$vid] = new Version($vid, $vid, reference.$rid, reference);
                this.import(reference.table, version, model);
                return version;
            }
            else {
                return Throw('Argument "reference" is empty');
            }
        };
        Repo.prototype.createReference = function ($rid, $table) {
            if ($table in this.descriptors) {
                return this.references[$rid] || (this.references[$rid] = new Reference(this, $rid, $table)); // Get or create a reference
            }
            else {
                return Throw('Table name "' + $table + '" not found');
            }
        };
        Repo.prototype.remove = function (value) {
            var $vid;
            if (value instanceof Reference) {
                var referenceVersions = value.versions;
                for ($vid in referenceVersions) {
                    this.deletes[$vid] = referenceVersions[$vid];
                    delete referenceVersions[$vid];
                }
                return value;
            }
            else if (value instanceof Version) {
                var reference = value.$;
                var referenceVersions = reference.versions;
                $vid = value.$vid;
                this.deletes[$vid] = referenceVersions[$vid];
                delete referenceVersions[$vid];
                return value;
            }
            else if (value in this.records) {
                var record = this.records[value];
                var reference = this.references[record.rid];
                var referenceVersions = reference.versions;
                var version = referenceVersions[value];
                this.deletes[value] = version;
                delete referenceVersions[value];
                return version;
            }
            else if (value in this.references) {
                var reference = this.references[value];
                var referenceVersions = reference.versions;
                for ($vid in referenceVersions) {
                    this.deletes[$vid] = referenceVersions[$vid];
                    delete referenceVersions[$vid];
                }
                return reference;
            }
            else {
                Throw('Value "' + value + '" not found in repository');
            }
        };
        Repo.prototype.unremove = function ($vid) {
            if ($vid in this.records) {
                var record = this.records[$vid];
                var reference = this.references[record.rid];
                var versions = reference.versions;
                versions[$vid] = this.deletes[$vid];
                delete this.deletes[$vid];
            }
            else {
                Throw('Version "' + $vid + '" not found');
            }
        };
        Repo.prototype.on = function (event, value, callback) {
            var i, key, length, values, handlers = toString.call(event) == '[object String]' ? this[event] : event;
            switch (toString.call(value)) {
                case '[object Array]':
                    values = value;
                    length = values.length;
                    for (i = 0; i < length; i++) {
                        value = values[i];
                        if (toString.call(value) === '[object String]') {
                            (handlers[value] || (handlers[value] = [])).push(callback);
                        }
                        else {
                            value = value.$rid;
                            (handlers[value] || (handlers[value] = [])).push(callback);
                        }
                    }
                    break;
                case '[object String]':
                    (handlers[value] || (handlers[value] = [])).push(callback);
                    break;
                default:
                    if (value instanceof Reference) {
                        value = value.$rid;
                        (handlers[value] || (handlers[value] = [])).push(callback);
                    }
                    else {
                        values = value;
                        for (key in values) {
                            value = values[key];
                            if (toString.call(value) === '[object String]') {
                                (handlers[value] || (handlers[value] = [])).push(callback);
                            }
                            else {
                                value = value.$rid;
                                (handlers[value] || (handlers[value] = [])).push(callback);
                            }
                        }
                    }
                    break;
            }
        };
        Repo.prototype.export = function ($table, version, model) {
            if (version) {
                model = model || {};
                var descriptor = this.descriptors[$table];
                var properties = descriptor.propertiesArray;
                var propertiesLength = properties.length;
                for (var index = 0; index < propertiesLength; index++) {
                    var property = properties[index];
                    var propertyName = property.name;
                    if (propertyName in version) {
                        model[propertyName] = property.export(version[propertyName], model[propertyName]);
                    }
                    else {
                        delete model[propertyName];
                    }
                }
                model.$vid = version.$vid;
            }
            return model;
        };
        Repo.prototype.import = function ($table, version, model) {
            if (version) {
                model = model || {};
                var descriptor = this.descriptors[$table];
                var properties = descriptor.propertiesArray;
                var propertiesLength = properties.length;
                for (var index = 0; index < propertiesLength; index++) {
                    var property = properties[index];
                    var propertyName = property.name;
                    if (propertyName in model) {
                        version[propertyName] = property.import(version[propertyName], model[propertyName]);
                    }
                    else {
                        delete version[propertyName];
                    }
                }
            }
            return version;
        };
        Repo.prototype.clone = function (idsOrVersionsOrReferences) {
            var clone = new Repo(this.declarations, this.defaultIndexConfiguration, this.indexConfigurations);
            if (arguments.length > 0) {
                var diff = this.checkout(idsOrVersionsOrReferences);
                clone.merge(diff);
            }
            return clone;
        };
        return Repo;
    })();
    Reflex.Repo = Repo;
})(Reflex || (Reflex = {}));
//# sourceMappingURL=main.js.map