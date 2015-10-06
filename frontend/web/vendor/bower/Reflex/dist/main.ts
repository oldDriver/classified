// Generic interfaces
module Reflex {
    export interface IStemmer {
        (input: string): string;
    }

    export interface Hash<T> {
        [key: string]: T;
    }

    export interface HashCapacity<T> {
        hash: Hash<T>;
        capacity: number;
    }

    export interface List<T> {
        length: number;
        [i: number]: T;

        pop(): T;
        push(...items: T[]): number;
        sort(compareFunction?: (a: T, b: T) => number);
    }
}

// AvlTree implementation
module Reflex {
    export interface AvlTreeNode<TKey, TValue> {
        balance: number;

        key: TKey;
        value: TValue;

        left: AvlTreeNode<TKey, TValue>;
        right: AvlTreeNode<TKey, TValue>;

        parent: AvlTreeNode<TKey, TValue>;
    }

    export interface Comparison<T> {
        (a: T, b: T): number;
    }

    export interface KeyValuePair<TKey, TValue> {
        key: TKey;
        value: TValue;
    };

    function _null<T>(node: T): T {
        return null;
    }

    function _identity<T>(value: T): T {
        return value;
    }

    function _throwDuplicateKeyException<TKey, TValue>(node: AvlTreeNode<TKey, TValue>, x: TValue): void {
        throw new Error("Element with key '" + x + "' was already added into the tree");
    }

    function _setValue<TKey, TValue>(node: AvlTreeNode<TKey, TValue>, x: TValue): void {
        node.value = x;
    }

    function _replace<TKey, TValue>(target: AvlTreeNode<TKey, TValue>, source: AvlTreeNode<TKey, TValue>): void {
        var left: AvlTreeNode<TKey, TValue> = source.left;
        var right: AvlTreeNode<TKey, TValue> = source.right;

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

    function _findNode<TKey, TValue>
    (
        comparer: Comparison<TKey>,
        node: AvlTreeNode<TKey, TValue>,
        key: TKey,
        left: (arg: AvlTreeNode<TKey, TValue>) => AvlTreeNode<TKey, TValue>,
        right: (arg: AvlTreeNode<TKey, TValue>) => AvlTreeNode<TKey, TValue>,
        center: (arg: AvlTreeNode<TKey, TValue>) => AvlTreeNode<TKey, TValue>
    ): AvlTreeNode<TKey, TValue> {
        if (node !== null) {
            while (true) {
                if (comparer(key, node.key) < 0) {
                    if (node.left) {
                        node = node.left;
                    } else {
                        return left(node);
                    }
                } else if (comparer(key, node.key)) {
                    if (node.right) {
                        node = node.right;
                    } else {
                        return right(node);
                    }
                } else {
                    return center(node);
                }
            }
        }

        return null;
    }

    function _step<TKey, TValue>(curr: AvlTreeNode<TKey, TValue>, predecessor: string, successor: string): AvlTreeNode<TKey, TValue> {
        if (curr !== null) {
            if (curr[successor] === null) {
                while (curr.parent !== null) {
                    var prev: AvlTreeNode<TKey, TValue> = curr;
                    curr = curr.parent;
                    if (curr[predecessor] === prev) {
                        return curr;
                    }
                }
            } else {
                curr = curr[successor];

                while (curr[predecessor] !== null) {
                    curr = curr[predecessor];
                }

                return curr;
            }
        }

        return null;
    }

    function _iterate<TKey, TValue>(curr: AvlTreeNode<TKey, TValue>, predecessor: string, successor: string, fn: (curr: AvlTreeNode<TKey, TValue>) => any): any {
        if (curr !== null) {
            var down, next, stop = fn(curr);

            if (curr[successor] === null) {
                // up
                down = false;
            } else {
                // down
                down = true;
                next = curr[successor];
            }

            while (stop === void 0) {
                if (down) {
                    curr = next;

                    while (curr[predecessor] !== null) curr = curr[predecessor];

                    next = curr[successor];

                    stop = fn(curr);

                    down = next !== null;
                } else if (curr.parent !== null) {
                    var prev = curr;

                    curr = curr.parent;

                    if (curr[predecessor] === prev) {
                        next = curr[successor];

                        stop = fn(curr);

                        down = next !== null;
                    }
                } else {
                    break;
                }
            }

            return stop;
        }

        return null;
    }

    function _insert<TKey, TValue>(key: TKey, value: TValue, onDuplicate: (node: AvlTreeNode<TKey, TValue>, value: TValue) => void): AvlTreeNode<TKey, TValue> {
        if (this.root === null) {
            var node: AvlTreeNode<TKey, TValue> = <AvlTreeNode<TKey, TValue>>{
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
            var node: AvlTreeNode<TKey, TValue> = this.root;

            while (node !== null) {
                var comparison: number = this.comparer(key, node.key);

                if (comparison < 0) {
                    var left: AvlTreeNode<TKey, TValue> = node.left;

                    if (left !== null) {
                        node = left;
                    }
                    else {
                        var result = node.left = <AvlTreeNode<TKey, TValue>>{
                            balance: 0,

                            key: key,
                            value: value,

                            left: null,
                            right: null,

                            parent: node,
                        };

                        _rebalance.call(this, node, 1);
                        this.count = this.count + 1;

                        return result;
                    }
                }
                else if (comparison > 0) {
                    var right: AvlTreeNode<TKey, TValue> = node.right;

                    if (right !== null) {
                        node = right;
                    }
                    else {
                        var result = node.right = <AvlTreeNode<TKey, TValue>>{
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

    function _insertLazy<TKey, TValue>(key: TKey, value: () => TValue, onDuplicate: (node: AvlTreeNode<TKey, TValue>, value: () => TValue) => void): AvlTreeNode<TKey, TValue> {
        if (this.root === null) {
            var node: AvlTreeNode<TKey, TValue> = <AvlTreeNode<TKey, TValue>>{
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
            var node: AvlTreeNode<TKey, TValue> = this.root;

            while (node !== null) {
                var comparison: number = this.comparer(key, node.key);

                if (comparison < 0) {
                    var left: AvlTreeNode<TKey, TValue> = node.left;

                    if (left !== null) {
                        node = left;
                    }
                    else {
                        var result = node.left = <AvlTreeNode<TKey, TValue>>{
                            balance: 0,

                            key: key,
                            value: value(),

                            left: null,
                            right: null,

                            parent: node,
                        };

                        _rebalance.call(this, node, 1);
                        this.count = this.count + 1;

                        return result;
                    }
                }
                else if (comparison > 0) {
                    var right: AvlTreeNode<TKey, TValue> = node.right;

                    if (right !== null) {
                        node = right;
                    }
                    else {
                        var result = node.right = <AvlTreeNode<TKey, TValue>>{
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

    function _rebalance<TKey, TValue>(node: AvlTreeNode<TKey, TValue>, balance: number): void {
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
            var parent: AvlTreeNode<TKey, TValue> = node.parent;
            if (parent !== null) {
                balance = ((parent.left === node) ? 1 : -1);
            }
            node = parent;
        }
    }

    function _unbalance<TKey, TValue>(treeNode: AvlTreeNode<TKey, TValue>, balance: number): void {
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
            var parent: AvlTreeNode<TKey, TValue> = treeNode.parent;
            if (parent !== null) {
                balance = ((parent.left === treeNode) ? -1 : 1);
            }
            treeNode = parent;
        }
    }

    function _rotateLeft<TKey, TValue>(node: AvlTreeNode<TKey, TValue>): AvlTreeNode<TKey, TValue> {
        var right: AvlTreeNode<TKey, TValue> = node.right;
        var left: AvlTreeNode<TKey, TValue> = right.left;
        var parent: AvlTreeNode<TKey, TValue> = node.parent;

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

    function _rotateRight<TKey, TValue>(node: AvlTreeNode<TKey, TValue>): AvlTreeNode<TKey, TValue> {
        var left: AvlTreeNode<TKey, TValue> = node.left;
        var right: AvlTreeNode<TKey, TValue> = left.right;
        var parent: AvlTreeNode<TKey, TValue> = node.parent;

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

    function _rotateLeftRight<TKey, TValue>(node: AvlTreeNode<TKey, TValue>): AvlTreeNode<TKey, TValue> {
        var left: AvlTreeNode<TKey, TValue> = node.left;
        var leftRight: AvlTreeNode<TKey, TValue> = left.right;
        var parent: AvlTreeNode<TKey, TValue> = node.parent;

        var leftRightRight: AvlTreeNode<TKey, TValue> = leftRight.right;
        var leftRightLeft: AvlTreeNode<TKey, TValue> = leftRight.left;

        leftRight.parent = parent;

        node.left = leftRightRight;
        left.right = leftRightLeft;

        leftRight.left = left;
        leftRight.right = node;

        left.parent = leftRight;
        node.parent = leftRight;

        if (leftRightRight !== null) leftRightRight.parent = node;
        if (leftRightLeft !== null) leftRightLeft.parent = left;

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

    function _rotateRightLeft<TKey, TValue>(treeNode: AvlTreeNode<TKey, TValue>): AvlTreeNode<TKey, TValue> {
        var right: AvlTreeNode<TKey, TValue> = treeNode.right;
        var rightLeft: AvlTreeNode<TKey, TValue> = right.left;
        var parent: AvlTreeNode<TKey, TValue> = treeNode.parent;
        var rightLeftLeft: AvlTreeNode<TKey, TValue> = rightLeft.left;
        var rightLeftRight: AvlTreeNode<TKey, TValue> = rightLeft.right;

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

    export class AvlTree<TKey, TValue>
    {
        comparer: Comparison<TKey>;

        count: number = 0;
        root: AvlTreeNode<TKey, TValue> = null;

        constructor(comparer: Comparison<TKey>) {
            this.comparer = comparer;
        }

        public remove(key: TKey): TValue {
            var node: AvlTreeNode<TKey, TValue> = this.root;
            while (node !== null) {
                if (this.comparer(key, node.key) < 0) {
                    node = node.left;
                }
                else {
                    if (this.comparer(key, node.key) <= 0) {
                        var left: AvlTreeNode<TKey, TValue> = node.left;
                        var right: AvlTreeNode<TKey, TValue> = node.right;

                        if (left === null) {
                            if (right === null) {
                                if (node === this.root) {
                                    this.root = null;
                                }
                                else {
                                    var parent: AvlTreeNode<TKey, TValue> = node.parent;
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
                                var successor: AvlTreeNode<TKey, TValue> = right;

                                if (successor.left === null) {
                                    var parent: AvlTreeNode<TKey, TValue> = node.parent;
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
                                    var parent: AvlTreeNode<TKey, TValue> = node.parent;
                                    var parent2: AvlTreeNode<TKey, TValue> = successor.parent;
                                    var right2: AvlTreeNode<TKey, TValue> = successor.right;
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
        }

        public find(key: TKey): AvlTreeNode<TKey, TValue> {
            var node = this.root;
            var comparer = this.comparer;

            if (node !== null) {
                while (true) {
                    if (comparer(key, node.key) < 0) {
                        if (node.left) {
                            node = node.left;
                        } else {
                            return null;
                        }
                    } else if (comparer(key, node.key)) {
                        if (node.right) {
                            node = node.right;
                        } else {
                            return null;
                        }
                    } else {
                        return node;
                    }
                }
            }

            return null;
        }

        public min(): AvlTreeNode<TKey, TValue> {
            var avlTreeNode: AvlTreeNode<TKey, TValue> = this.root;
            while (avlTreeNode.left !== null) {
                avlTreeNode = avlTreeNode.left;
            }
            return avlTreeNode;
        }
        public max(): AvlTreeNode<TKey, TValue> {
            var avlTreeNode: AvlTreeNode<TKey, TValue> = this.root;
            while (avlTreeNode.right !== null) {
                avlTreeNode = avlTreeNode.right;
            }
            return avlTreeNode;
        }

        public next(curr: AvlTreeNode<TKey, TValue>): AvlTreeNode<TKey, TValue> {
            return _step(curr, "left", "right");
        }

        public prev(curr: AvlTreeNode<TKey, TValue>): AvlTreeNode<TKey, TValue> {
            return _step(curr, "right", "left");
        }

        public findNext(key: TKey): AvlTreeNode<TKey, TValue> {
            return _findNode(this.comparer, this.root, key, _identity, this.next, this.next);
        }

        public findPrev(key: TKey): AvlTreeNode<TKey, TValue> {
            return _findNode(this.comparer, this.root, key, this.prev, _identity, this.prev);
        }

        public findCurrOrNext(key: TKey): AvlTreeNode<TKey, TValue> {
            return _findNode(this.comparer, this.root, key, _identity, this.next, _identity);
        }

        public findCurrOrPrev(key: TKey): AvlTreeNode<TKey, TValue> {
            return _findNode(this.comparer, this.root, key, this.prev, _identity, _identity);
        }

        public iterateForward(curr: AvlTreeNode<TKey, TValue>, fn: (node: AvlTreeNode<TKey, TValue>) => any): any {
            return _iterate(curr, 'left', 'right', fn);
        }

        public iterateReverse(curr: AvlTreeNode<TKey, TValue>, fn: (node: AvlTreeNode<TKey, TValue>) => any): any {
            return _iterate(curr, 'right', 'left', fn);
        }

        public add(key: TKey, value: TValue): AvlTreeNode<TKey, TValue> {
            return _insert.call(this, key, value, _throwDuplicateKeyException);
        }

        public put(key: TKey, value: TValue): AvlTreeNode<TKey, TValue> {
            return _insert.call(this, key, value, _setValue);
        }

        public getOrAdd(key: TKey, value: TValue): TValue {
            return _insert.call(this, key, value, _identity).value;
        }

        public getOrAddLazy(key: TKey, value: () => TValue): TValue {
            return _insertLazy.call(this, key, value, _identity).value;
        }

        public clear(): void {
            this.root = null;
            this.count = 0;
        }

        public toList(): KeyValuePair<TKey, TValue>[] {
            var result: KeyValuePair<TKey, TValue>[] = [];

            this.iterateForward(this.min(), function (node) {
                result.push({
                    key: node.key,
                    value: node.value
                })
            });

            return result;
        }
    }
}

module Reflex.Stemmers.Porter {
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
        }, c = "[^aeiou]",          // consonant
        v = "[aeiouy]",          // vowel
        C = c + "[^aeiouy]*",    // consonant sequence
        V = v + "[aeiou]*",      // vowel sequence

        mgr0 = "^(" + C + ")?" + V + C,               // [C]VC... is m>0
        meq1 = "^(" + C + ")?" + V + C + "(" + V + ")?$",  // [C]VC[V] is m=1
        mgr1 = "^(" + C + ")?" + V + C + V + C,       // [C]VCVC... is m>1
        s_v = "^(" + C + ")?" + v;                   // vowel in stem

    export var Stemmer: IStemmer = function (w: string): string {
        var
            stem,
            suffix,
            firstch,
            re,
            re2,
            re3,
            re4,
            origword = w;

        if (w.length < 3) { return w; }

        firstch = w.substr(0, 1);
        if (firstch == "y") {
            w = firstch.toUpperCase() + w.substr(1);
        }

        // Step 1a
        re = /^(.+?)(ss|i)es$/;
        re2 = /^(.+?)([^s])s$/;

        if (re.test(w)) {
            w = w.replace(re, "$1$2");
        } else if (re2.test(w)) {
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
        } else if (re2.test(w)) {
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
                } else if (re3.test(w)) {
                    re = /.$/;
                    w = w.replace(re, "");
                } else if (re4.test(w)) {
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
        } else if (re2.test(w)) {
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
}

module Reflex {
    export interface SearchResult {
        value: any;
        score: number;

        $vid: string;
        reference: Reference;
    }

    export interface SearchResults {
        count: number;
        results: Hash<SearchResult>;
    }

    export interface Term {
        value: string;
        positionsCount: number;
        positions: Hash<List<number>>;
    }

    export interface Document {
        $did: number;

        $value: any;

        $norm: number;

        $terms: Hash<Term>;
        $termsCount: number;

        $vid: string;
        $reference: Reference;
    }

    export interface PipelineFunction {
        (value: any): string[];
    }

    export interface PipelineConfiguration extends List<PipelineFunction> {
    }

    export interface IndexConfiguration {
        searchPipeline: PipelineConfiguration;
        insertPipeline: PipelineConfiguration;
    }

    export interface IndexConfigurations {
        [configurationName: string]: IndexConfiguration;
    }

    function _createTerms(): Hash<Term> {
        return {};
    }

    function _ascendingComparison(a, b): number {
        if (a < b) {
            return -1;
        } else if (a > b) {
            return 1;
        } else {
            return 0;
        }
    }

    function _descendingComparison(a, b): number {
        if (a < b) {
            return 1;
        } else if (a > b) {
            return -1;
        } else {
            return 0;
        }
    }

    function _binarySearch<T>(list: List<T>, key: T, none: T, min: number, max: number, below: (list: List<T>, index: number) => T, above: (list: List<T>, index: number) => T, center: (list: List<T>, index: number) => T, comparison: Comparison<T>): T {
        if (list.length > 0)
        {
            while (true)
            {
                var mid = (min + max) >> 1;

                var cmp = comparison(key, list[mid]);

                if (cmp < 0)
                {
                    max = mid - 1;

                    if (min > max)
                    {
                        return below(list, mid);
                    }
                }
                else if (cmp > 0)
                {
                    min = mid + 1;

                    if (min > max)
                    {
                        return above(list, mid);
                    }
                }
                else
                {
                    return center(list, mid);
                }
            }
        }

        return none;
    }

    function _prevBinarySearch<T>(list: List<T>, key: T, none: T, comparison: Comparison<T>): T {
        return _binarySearch
        (
            list,
            key,
            none,
            0,
            list.length - 1,
            (l, i) => i - 1 >= 0 ? l[i - 1] : none,
            (l, i) => l[i],
            (l, i) => i - 1 >= 0 ? l[i - 1] : none,
            comparison
        );
    }

    function _nextBinarySearch<T>(list: List<T>, key: T, none: T, comparison: Comparison<T>): T {
        return _binarySearch
        (
            list,
            key,
            none,
            0,
            list.length - 1,
            (l, i) => l[i],
            (l, i) => i + 1 < l.length ? l[i + 1] : none,
            (l, i) => i + 1 < l.length ? l[i + 1] : none,
            comparison
        );
    }

    function _currOrNextBinarySearch<T>(list: List<T>, key: T, none: T, comparison: Comparison<T>): T {
        return _binarySearch
        (
            list,
            key,
            none,
            0,
            list.length - 1,
            (l, i) => i - 1 >= 0 ? l[i - 1] : none,
            (l, i) => l[i],
            (l, i) => l[i],
            comparison
        );
    }

    function _currOrPrevBinarySearch<T>(list: List<T>, key: T, none: T, comparison: Comparison<T>): T {
        return _binarySearch
        (
            list,
            key,
            none,
            0,
            list.length - 1,
            (l, i) => l[i],
            (l, i) => i + 1 < l.length ? l[i + 1] : none,
            (l, i) => l[i],
            comparison
        );
    }

    export class Index {
        private corpus: AvlTree<string, Hash<Term>>;

        private documentsCount: number = 0;
        private documents: Hash<Document> = {};
        private documentsByVersion: Hash<Hash<Document>> = {};

        private insertPipeline: PipelineConfiguration;
        private searchPipeline: PipelineConfiguration;

        public constructor(configuration: IndexConfiguration) {
            this.insertPipeline = configuration.insertPipeline;
            this.searchPipeline = configuration.searchPipeline;

            this.corpus = new AvlTree<string, Hash<Term>>(_ascendingComparison);
        }

        public add(reference: Reference, $vid: string, value: any): Document {
            var $did = this.documentsCount++;

            var tokens: string[] = value;

            var pipeline = this.insertPipeline, count = pipeline.length;

            for (var index = 0; index < count; index++) {
                tokens = pipeline[index](tokens);
            }

            var corpus = this.corpus;
            var count = tokens.length;

            var documentTerms: Hash<Term> = {};
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
                    documentTermsCount++
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

            var document: Document = {
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
        }

        public intersect(query: any, intersection: Hash<SearchResult>, iterator: (score: number, document: Document) => any): any {
            var tokens: string[] = query;

            var documents = this.documents, pipeline = this.insertPipeline, count = pipeline.length;

            for (var index = 0; index < count; index++) {
                tokens = pipeline[index](tokens);
            }

            var corpus = this.corpus;

            var count = tokens.length;

            var queryTermsByToken: List<Hash<Term>> = [];
            var queryTermsFrequencies: Hash<number> = {};
            var queryTermsCountsByToken: List<number> = [];

            var queryDocumentsByToken: List<HashCapacity<Document>> = [];

            var token: string, queryTerms: Hash<Term>, queryTermsCount: number;

            var queryDocuments: Hash<Document> = {};
            var queryDocumentsCount: number = 0;

            var fn = intersection ? (node) => {
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
                } else {
                    return true; // returning non undefined result would break the iteration
                }
            } : (node) => {
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
                } else {
                    return true; // returning non undefined result would break the iteration
                }
            };

            for (var index = 0; index < count; index++) {
                var token = tokens[index];
                var queryTerms: Hash<Term> = {};
                var queryTermsCount: number = 0;

                var queryDocuments: Hash<Document> = {};
                var queryDocumentsCount: number = 0;

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

            queryDocumentsByToken.sort((a: HashCapacity<Document>, b: HashCapacity<Document>) => { return a.capacity - b.capacity });

            if (count > 1) {
                var queryDocumentsIntersection: Hash<Document>;
                var queryDocumentsIntersectionCapacity: number;
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
            } else if (count > 0) {
                var queryDocumentsIntersection: Hash<Document> = queryDocumentsByToken[0].hash;
                var queryDocumentsIntersectionCapacity: number = queryDocumentsByToken[0].capacity;
                var queryDocumentsIntersectionArgument = queryDocumentsIntersection;
            } else {
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

                    var documentQueryTerms: List<Term> = [];

                    if (queryTermsCountsByToken[index] < $termsCount) {
                        for (var termKey in queryTerms) {
                            var term = $terms[termKey];
                            if (term) {
                                documentQueryTerms.push(term);
                            }
                        }
                    } else {
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

                        var nearest = _nextBinarySearch<number>(positions, position, null, _ascendingComparison);
                        if (nearest !== null && nearest < minimalTermsPosition) {
                            minimalTermsPosition = nearest;
                            minimalTermsPositionFound = true;
                        }
                    }

                    if (minimalTermsPositionFound) {
                        position = minimalTermsPosition;
                    } else {
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
        }

        public remove($vid: string): void {
            var corpus = this.corpus;
            var documentsByVersion = this.documentsByVersion[$vid];

            for (var $did in documentsByVersion) {
                var token: string;
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
                                                throw new Error('Was unable to remove part from the corpus, this is a sign of data corruption or bug in Reflex, please contact Reflex dev team via creating an issue on Refliex github page')
                                            }
                                        }
                                    } else {
                                        throw new Error('A term dictionary hashed by token didn\'t contain current token, however it should have existed, this is a sign of data corruption or bug in Reflex, please contact Reflex dev team via creating an issue on Refliex github page');
                                    }
                                } else {
                                    throw new Error("Part wasn't found in corpus, however it should have existed, this is a sign of data corruption or bug in Reflex, please contact Reflex dev team via creating an issue on Refliex github page");
                                }
                            }
                        }
                    } else {
                        throw new Error("Positions collection didn't contain the searched $did, this is a sign of bug in Reflex, please contact Reflex dev team via creating an issue on Refliex github page");
                    }
                }
            }

            if (!delete this.documentsByVersion[$vid]) {
                throw new Error("Was unable to remove version from documentsByVersion, this is a sign of bug in Reflex, please contact Reflex dev team via creating an issue on Refliex github page");
            }
        }
    }
}

module Reflex {
    'use strict';

    var emptyHash = {};
    var emptyList = [];

    export enum Type {
        Atom,
        Hash,
        Array,
        Reference
    }

    export interface TableDeclaration {
        FORCE_STRICT_DUCK_TYPING_FOR_TableDeclaration: any; // Force more strict duck typing
        [propertyName: string]: PropertyDeclaration;
    }

    export interface PropertyDeclaration {
        of: string;
        index: string;

        type: TypeDeclaration;

        FORCE_STRICT_DUCK_TYPING_FOR_PropertyDeclaration: any; // Force more strict duck typing
    }

    export interface TypeDeclaration {
        name: string;
        index: string;
        FORCE_STRICT_DUCK_TYPING_FOR_TypeDeclaration: any; // Force more strict duck typing
    }

    export interface Proto {
        FORCE_STRICT_DUCK_TYPING_FOR_Proto: any; // Force more strict duck typing
    }

    export class Version {
        public constructor(public $vid: string, public $cid: string, public $rid: string, public $: Reference) {
        }
    }

    export interface Record { // Item is an object that contains service fields such as `Id`, `PreviousId`, `UUID`, `TableName`, `OperationId`, `CreatedOn`, `RecoverdOn`, `UpdatedOnPrev`, `UpdatedOnCurr`, `UpdatedOnNext` and serialized data (Model) which is contained in `Json` field
        cid: string;
        vid: string;
        rid: string;
        pid: string;

        proto: Proto;
        table: string;

        createdOn: number;
        updatedOn: number;
        recoveredOn: number;
    }

    export interface Table {
        [$rid: string]: Reference;
        FORCE_STRICT_DUCK_TYPING_FOR_Table: any; // Force more strict duck typing
    }

    export interface Tables {
        [$table: string]: Table;
        FORCE_STRICT_DUCK_TYPING_FOR_Tables: any; // Force more strict duck typing
    }

    export interface OwnerTable {
        [$vid: string]: Version;
        FORCE_STRICT_DUCK_TYPING_FOR_OwnerTable: any; // Force more strict duck typing
    }

    export interface OwnerProperties {
        [propertyName: string]: OwnerTable;
        FORCE_STRICT_DUCK_TYPING_FOR_OwnerTable: any; // Force more strict duck typing
    }

    export interface OwnerTables {
        [$table: string]: OwnerProperties;
        FORCE_STRICT_DUCK_TYPING_FOR_OwnerTables: any; // Force more strict duck typing
    }

    export interface TableDescriptors {
        [$table: string]: TableDescriptor;
        FORCE_STRICT_DUCK_TYPING_FOR_TableDescriptors: any; // Force more strict duck typing
    }

    export interface DescriptorCache {
        FORCE_STRICT_DUCK_TYPING_FOR_DescriptorCache: any; // Force more strict duck typing
        ($table: string): TableDescriptor;
    }

    var isEmpty = function (obj: Object): boolean {
        for (var i in obj) {
            return false;
        }

        return true;
    };

    var toString = Object.prototype.toString;
    var hasOwnProperty = Object.prototype.hasOwnProperty;

    function foreach(obj: Object, fn: (value?: any, key?: any, collection?: Object) => any, ctx?: any) {
        if (toString.call(fn) !== '[object Function]') {
            throw new TypeError('iterator must be a function');
        }
        var l = (<any>obj).length, i, r;
        if (l === +l) {
            for (i = 0; i < l; i += 1) {
                r = fn.call(ctx, obj[i], i, obj);
                if (r !== undefined) {
                    return r;
                }
            }
        } else {
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

    function Throw(message?: string): any {
        throw new Error(message);
    }

    function ThrowPureAbstractCall(): any {
        throw new Error('A pure abstract call was issued');
    }

    function ThrowArgumentNullException(parameterName?: string): any {
        if (parameterName) {
            throw new Error('Argument "' + parameterName + '" was not defined');
        } else {
            throw new Error('Argument not defined');
        }
    }

    function ThrowInvalidOperationException(): any {
        Throw('Invalid operation');
    }

    export class Reference {
        public owners: OwnerTables;
        public versions: Hash<Version>;

        public constructor(public repo: Repo, public $rid: string, public table: string) {
            this.owners = <OwnerTables><any>{};
            this.versions = <Hash<Version>><any>{};
        }
    }

    export class TypeDescriptor {
        constructor(public repo: Repo, public tableDescriptor: TableDescriptor, public propertyDescriptor: PropertyDescriptor, public type: Type) {
        }

        static fromRecord(repo: Repo, tableDescriptor: TableDescriptor, propertyDescriptor: PropertyDescriptor, typeDeclaration: PropertyDeclaration, descriptorCache: DescriptorCache): TypeDescriptor {
            if (typeDeclaration) {
                var typeName, indexConfigurationName;

                if (typeDeclaration.type) {
                    if (typeDeclaration.type.name) {
                        typeName = typeDeclaration.type.name;
                        indexConfigurationName = typeDeclaration.type.index || tableDescriptor.repo.defaultIndexConfiguration;
                    } else {
                        typeName = typeDeclaration.type;
                        indexConfigurationName = typeDeclaration.index || tableDescriptor.repo.defaultIndexConfiguration;
                    }
                } else {
                    typeName = typeDeclaration;
                    indexConfigurationName = tableDescriptor.repo.defaultIndexConfiguration;
                }

                switch (typeName) {
                    case Type[Type.Atom]:
                        return new AtomDescriptor(repo, tableDescriptor, propertyDescriptor, tableDescriptor.repo.indexConfigurations[indexConfigurationName] || Throw('Index configuration "' + indexConfigurationName + '" not found'));
                    case Type[Type.Hash]:
                        return new HashDescriptor(repo, tableDescriptor, propertyDescriptor, TypeDescriptor.fromRecord(repo, tableDescriptor, propertyDescriptor, <PropertyDeclaration><any>typeDeclaration.of, descriptorCache));
                    case Type[Type.Array]:
                        return new ArrayDescriptor(repo, tableDescriptor, propertyDescriptor, TypeDescriptor.fromRecord(repo, tableDescriptor, propertyDescriptor, <PropertyDeclaration><any>typeDeclaration.of, descriptorCache));
                    case Type[Type.Reference]:
                        return new ReferenceDescriptor(repo, tableDescriptor, propertyDescriptor, descriptorCache(typeDeclaration.of));
                    default:
                        return new ReferenceDescriptor(repo, tableDescriptor, propertyDescriptor, descriptorCache(typeName)); // This should be a TypeName then
                }
            } else {
                ThrowArgumentNullException('typeDeclaration');
            }
        }

        public index(reference: Reference, $vid: string, value: any): void {
            ThrowPureAbstractCall();
        }

        public deindex($vid: string): void {
            ThrowPureAbstractCall();
        }

        public intersect(query: string, intersection: Hash<SearchResult>, fn: (searchResult: SearchResult) => any): any {
            return ThrowPureAbstractCall();
        }

        public recursiveSearchToken(token: string, cache: Hash<Hash<SearchResult>>): SearchResults {
            return ThrowPureAbstractCall();
        }

        public export($vid: any, model: any): any {
            return ThrowPureAbstractCall();
        }

        public import($vid: any, model: any): any {
            return ThrowPureAbstractCall();
        }
    }

    export class CollectionDescriptor extends TypeDescriptor {
        public baseType: TypeDescriptor;

        constructor(repo: Repo, tableDescriptor: TableDescriptor, propertyDescriptor: PropertyDescriptor, type: Type, public of: TypeDescriptor) {
            super(repo, tableDescriptor, propertyDescriptor, type);

            if (of instanceof CollectionDescriptor) {
                this.baseType = (<CollectionDescriptor>of).baseType
            } else if (of instanceof TerminalDescriptor) {
                this.baseType = of;
            } else {
                throw new Error('Unexpected descriptor type');
            }
        }

        public intersect(query: string, intersection: Hash<SearchResult>, fn: (searchResult: SearchResult) => any): any {
            return this.of.intersect(query, intersection, fn);
        }

        public recursiveSearchToken(token: string, cache: Hash<Hash<SearchResult>>): SearchResults {
            return this.of.recursiveSearchToken(token, cache);
        }

        public reference(references: Hash<Reference>, ownerRecord: Record, owner: Version, value: any): void {
            return ThrowPureAbstractCall();
        }

        public checkout(records: Hash<Record>, model: any, cache: Hash<Version>, result: List<Record>): void {
            return ThrowPureAbstractCall();
        }

        public clone(value: any): any {
            return ThrowPureAbstractCall();
        }

        public contains(value: any, query: (value: any) => boolean, cache: Hash<boolean>): boolean {
            return ThrowPureAbstractCall();
        }

        public changed(models: any, protos: any): boolean {
            return ThrowPureAbstractCall();
        }

        public dereference(models: any): any {
            return ThrowPureAbstractCall();
        }

        public cleanup(references: Hash<Reference>, ownerRecord: Record, value: any): any {
            return ThrowPureAbstractCall();
        }
    }

    export class ArrayDescriptor extends CollectionDescriptor {
        constructor(repo: Repo, tableDescriptor: TableDescriptor, propertyDescriptor: PropertyDescriptor, of: TypeDescriptor) {
            super(repo, tableDescriptor, propertyDescriptor, Type.Array, of);

            if (of instanceof TerminalDescriptor) {
                this.reference = this.referenceTerminal;
                this.checkout = this.checkoutTerminal;
                this.cleanup = this.cleanupTerminal;
                this.clone = this.cloneTerminal;

                if (of instanceof AtomDescriptor) {
                    this.changed = this.changedTerminalAtom;
                    this.contains = this.containsTerminalAtom;
                    this.dereference = this.dereferenceTerminalAtom;

                } else if (of instanceof ReferenceDescriptor) {
                    this.changed = this.changedTerminalReference;
                    this.contains = this.containsTerminalReference;
                    this.dereference = this.dereferenceTerminalReference;
                } else {
                    Throw("Unexpected descriptor type");
                }

            } else {
                this.dereference = this.dereferenceCollection;
                this.reference = this.referenceCollection;
                this.checkout = this.checkoutCollection;
                this.contains = this.containsCollection;
                this.cleanup = this.cleanupCollection;
                this.changed = this.changedCollection;
                this.clone = this.cloneCollection;
            }
        }

        public export(versions: any[], models: any[]): any[] {
            if (versions) {
                var of = this.of;

                models = models || [];
                models.length = versions.length;

                var versionsLength = versions.length;

                for (var index = 0; index < versionsLength; index++) {
                    models[index] = of.export(versions[index], models[index]);
                }

                return models;
            } else {
                return versions;
            }
        }

        public import(versions: any[], models: any[]): any[] {
            if (models) {
                var of = this.of;

                versions = versions || [];
                versions.length = models.length;

                var modelsLength = models.length;

                for (var index = 0; index < modelsLength; index++) {
                    versions[index] = of.import(versions[index], models[index]);
                }

                return versions;
            } else {
                return models;
            }
        }

        public index(reference: Reference, $vid: string, values: List<Version>): void {
            var of = this.of;
            var count = values.length;

            for (var i = 0; i < count; i++) {
                var value = values[i];

                if (value) {
                    of.index(reference, $vid, value);
                }
            }
        }

        public cleanupTerminal(references: Hash<Reference>, record: Record, referenceArray: Reference[]) {
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
                        } else {
                            if (isEmpty(ownerProperties)) {
                                delete reference.owners[$table];
                            }
                        }
                    }
                }
            }
        }

        public cleanupCollection(references: Hash<Reference>, record: Record, models: Version): void {
            var of = this.of;
            var count = (<Version[]><any>models).length;

            for (var i = 0; i < count; i++) {
                var reference = models[i];

                if (reference) {
                    (<CollectionDescriptor>of).cleanup(references, record, reference);
                }
            }
        }

        public referenceTerminal(references: Hash<Reference>, ownerRecord: Record, owner: Version, models: Version): void {
            var count = (<Version[]><any>models).length;
            var ownerVersion = ownerRecord.vid;
            var ownerTable = ownerRecord.table;

            var referenceTableName = (<ReferenceDescriptor>this.of).of.name;
            var referencePropertyName = this.propertyDescriptor.name;

            for (var i = 0; i < count; i++) {
                var $rid = models[i];

                if ($rid) {
                    var reference = models[i] = (references[$rid] || (references[$rid] = new Reference(this.repo, $rid, referenceTableName)));
                    var properties = reference.owners[ownerTable] || (reference.owners[ownerTable] = <OwnerProperties><any>{});

                    var table = properties[referencePropertyName] || (properties[referencePropertyName] = <OwnerTable><any>{});

                    table[ownerVersion] = owner;
                }
            }
        }

        public referenceCollection(references: Hash<Reference>, ownerRecord: Record, owner: Version, models: Version): void {
            var of = this.of;
            var count = (<Version[]><any>models).length;

            for (var i = 0; i < count; i++) {
                var reference = models[i];

                if (reference) {
                    (<CollectionDescriptor>of).reference(references, ownerRecord, owner, reference);
                }
            }
        }

        public checkoutCollection(records: Hash<Record>, models: List<Version>, cache: Hash<Version>, result: List<Record>): void {
            var of = <CollectionDescriptor>this.of;
            var length = models.length;

            for (var i = 0; i < length; i++) {
                var model = models[i];

                if (model) {
                    of.checkout(records, model, cache, result);
                }
            }
        }

        public checkoutTerminal(records: Hash<Record>, models: List<Reference>, cache: Hash<Version>, result: List<Record>): void {
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
        }

        public cloneCollection(protos: Proto[]): Proto[] {
            var of = <CollectionDescriptor>this.of;

            var result = <Proto[]>[];
            var length = result.length = protos.length;

            for (var i = 0; i < length; i++) {
                var proto = protos[i];

                if (proto) {
                    result[i] = of.clone(proto);
                } else {
                    result[i] = proto;
                }
            }

            return result;
        }

        public cloneTerminal(protos: Proto[]): Proto[] {
            var result = <Proto[]>[];
            var length = result.length = protos.length;

            for (var i = 0; i < length; i++) {
                result[i] = protos[i];
            }

            return result;
        }

        public changedCollection(models: Version[], protos: Proto[]): boolean {
            var of = <CollectionDescriptor>this.of;

            if (models.length === protos.length) {
                var length = protos.length;

                for (var i = 0; i < length; i++) {
                    var model = models[i];
                    var proto = protos[i];

                    if (model && proto) {
                        if (of.changed(model, proto)) {
                            return true
                        }
                    } else if (model || proto || (<any>model) !== (<any>proto)) {
                        return true
                    }
                }
            } else {
                return true;
            }

            return false;
        }

        public changedTerminalAtom(models: Version[], protos: Proto[]): boolean {
            if (models.length === protos.length) {
                var length = protos.length;

                for (var i = 0; i < length; i++) {
                    if (<any>models[i] !== <any>protos[i]) {
                        return true;
                    }
                }
            } else {
                return true;
            }

            return false;
        }

        public changedTerminalReference(models: Reference[], protos: string[]): boolean {
            if (models.length === protos.length) {
                var length = protos.length;

                for (var i = 0; i < length; i++) {
                    var model = models[i];
                    var proto = protos[i];

                    if (model && proto) {
                        if (model.$rid !== proto) {
                            return true
                        }
                    } else if (model || proto || (<any>model) !== (<any>proto)) {
                        return true
                    }
                }
            } else {
                return true;
            }

            return false;
        }

        public containsCollection(collections: any[], query: (value: any) => boolean, cache: Hash<boolean>): boolean {
            var of = <CollectionDescriptor>this.of;
            var length = collections.length;

            for (var i = 0; i < length; i++) {
                var collection = collections[i];

                if (collection && of.contains(collection, query, cache)) return true
            }

            return false;
        }

        public containsTerminalAtom(collection: Version[], query: (value: any) => boolean, cache: Hash<boolean>): boolean {
            var of = <CollectionDescriptor>this.of;
            var length = collection.length;

            for (var i = 0; i < length; i++) {
                var atom = collection[i];

                if (atom && query(atom)) return true;
            }

            return false;
        }

        public containsTerminalReference(references: Reference[], query: (value: any) => boolean, cache: Hash<boolean>): boolean {
            var of = (<ReferenceDescriptor>this.of).of;
            var length = references.length;

            for (var i = 0; i < length; i++) {
                var reference = references[i];

                if (reference && of.contains(reference, query, cache)) return true;
            }

            return false;
        }

        public dereferenceCollection(models: Version[]): Proto[] {
            var of = <CollectionDescriptor>this.of;

            var result = <Proto[]>[];
            var length = result.length = models.length;

            for (var i = 0; i < length; i++) {
                var model = models[i];

                if (model) {
                    result[i] = of.dereference(model);
                } else {
                    result[i] = <any>model;
                }
            }

            return result;
        }

        public dereferenceTerminalAtom(models: Version[]): Proto[] {
            var result = <Proto[]>[];
            var length = result.length = models.length;

            for (var i = 0; i < length; i++) {
                result[i] = <any>models[i];
            }

            return result;
        }

        public dereferenceTerminalReference(models: Reference[]): string[] {
            var result = <string[]>[];
            var length = result.length = models.length;

            for (var i = 0; i < length; i++) {
                var model = models[i];

                if (model) {
                    result[i] = model.$rid;
                } else {
                    result[i] = <any>model;
                }
            }

            return result;
        }
    }

    export class HashDescriptor extends CollectionDescriptor {
        constructor(repo: Repo, tableDescriptor: TableDescriptor, propertyDescriptor: PropertyDescriptor, of: TypeDescriptor) {
            super(repo, tableDescriptor, propertyDescriptor, Type.Hash, of)

            if (of instanceof TerminalDescriptor) {
                this.reference = this.referenceTerminal;
                this.checkout = this.checkoutTerminal;
                this.cleanup = this.cleanupTerminal;
                this.clone = this.cloneTerminal;

                if (of instanceof AtomDescriptor) {
                    this.changed = this.changedTerminalAtom;
                    this.contains = this.containsTerminalAtom;
                    this.dereference = this.dereferenceTerminalAtom;
                } else if (of instanceof ReferenceDescriptor) {
                    this.changed = this.changedTerminalReference;
                    this.contains = this.containsTerminalReference;
                    this.dereference = this.dereferenceTerminalReference;
                } else {
                    Throw("Unexpected descriptor type");
                }
            } else {
                this.dereference = this.dereferenceCollection;
                this.reference = this.referenceCollection;
                this.checkout = this.checkoutCollection;
                this.contains = this.containsCollection;
                this.cleanup = this.cleanupCollection;
                this.changed = this.changedCollection;
                this.clone = this.cloneCollection;
            }
        }

        public export(versions: Hash<any>, models: Hash<any>): Hash<any> {
            if (versions) {
                var of = this.of;

                models = models || <Hash<any>>{};

                for (var key in versions) {
                    models[key] = of.export(versions[key], models[key]);
                }

                return models;
            } else {
                return versions;
            }
        }

        public import(versions: Hash<any>, models: Hash<any>): Hash<any> {
            if (models) {
                var of = this.of;

                versions = versions || {};

                for (var index in models) {
                    versions[index] = of.import(versions[index], models[index]);
                }

                return versions;
            } else {
                return models;
            }
        }

        public index(reference: Reference, $vid: string, models: Hash<Version>): void {
            var of = this.of;

            for (var key in models) {
                var model = models[key];

                if (model) {
                    of.index(reference, $vid, model);
                }
            }
        }

        public cleanupTerminal(references: Hash<Reference>, record: Record, referenceHash: Hash<Reference>) {
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
                        } else {
                            if (isEmpty(ownerProperties)) {
                                delete reference.owners[$table];
                            }
                        }
                    }
                }
            }
        }

        public cleanupCollection(references: Hash<Reference>, record: Record, models: Hash<Reference>): void {
            var of = this.of;

            for (var key in models) {
                var reference = models[key];

                if (reference) {
                    (<CollectionDescriptor>of).cleanup(references, record, reference);
                }
            }
        }

        public referenceTerminal(references: Hash<Reference>, ownerRecord: Record, owner: Version, models: Hash<Reference>): void {
            var ownerVersion = ownerRecord.vid;
            var ownerTable = ownerRecord.table;
            var referenceTableName = (<ReferenceDescriptor>this.of).of.name;
            var referencePropertyName = this.propertyDescriptor.name;

            for (var key in models) {
                var $rid = <string><any>models[key];

                if ($rid) {
                    var reference = models[key] = (references[$rid] || (references[$rid] = new Reference(this.repo, $rid, referenceTableName)));
                    var referenceProperties = reference.owners[ownerTable] || (reference.owners[ownerTable] = <OwnerProperties><any>{});
                    var referenceTable = referenceProperties[referencePropertyName] || (referenceProperties[referencePropertyName] = <OwnerTable><any>{});

                    referenceTable[ownerVersion] = owner;
                }
            }
        }

        public referenceCollection(references: Hash<Reference>, ownerRecord: Record, owners: Version, models: Hash<Version[]>): void {
            var of = this.of;

            for (var key in models) {
                var model = models[key];

                if (model) {
                    (<CollectionDescriptor>of).reference(references, ownerRecord, owners, model);
                }
            }
        }

        public checkoutCollection(records: Hash<Record>, models: Hash<Version>, cache: Hash<Version>, result: List<Record>): void {
            var of = <CollectionDescriptor>this.of;

            for (var key in models) {
                var model = models[key];

                if (model) {
                    of.checkout(records, model, cache, result);
                }
            }
        }

        public checkoutTerminal(records: Hash<Record>, models: Hash<Reference>, cache: Hash<Version>, result: List<Record>): void {
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
        }

        public cloneCollection(protos: Hash<Proto>): Hash<Proto> {
            var of = <CollectionDescriptor>this.of;

            var result = <Hash<Proto>><any>{};

            for (var i in protos) {
                var proto = protos[i];

                if (proto) {
                    result[i] = of.clone(proto);
                } else {
                    result[i] = proto;
                }
            }

            return result;
        }

        public cloneTerminal(protos: Hash<Proto>): Hash<Proto> {
            var result = <Hash<Proto>><any>{};

            for (var key in protos) {
                result[key] = protos[key];
            }

            return result;
        }

        public changedCollection(models: Hash<Version>, protos: Hash<Proto>): boolean {
            var of = <CollectionDescriptor>this.of;

            for (var key in protos) {
                if (key in models) {
                    var model = models[key];
                    var proto = protos[key];

                    if (model && proto) {
                        if (of.changed(models[key], protos[key])) {
                            return true
                        }
                    } else if (model || proto || (<any>model) !== (<any>proto)) {
                        return true;
                    }
                } else {
                    return true;
                }
            }

            for (var key in models) {
                if (!(key in protos)) {
                    return true;
                }
            }

            return false;
        }

        public changedTerminalAtom(models: Hash<Version>, protos: Hash<Proto>): boolean {
            for (var key in protos) {
                if (key in models) {
                    if ((<any>models[key]) !== (<any>protos[key])) {
                        return true;
                    }
                } else {
                    return true;
                }
            }

            for (var key in models) {
                if (!(key in protos)) {
                    return true;
                }
            }

            return false;
        }

        public changedTerminalReference(models: Hash<Reference>, protos: Hash<string>): boolean {
            for (var key in protos) {
                if (key in models) {
                    var model = models[key];
                    var proto = protos[key];

                    if (model && proto) {
                        if (models[key].$rid !== protos[key]) {
                            return true
                        }
                    } else if (model || proto || (<any>model) !== (<any>proto)) {
                        return true;
                    }
                } else {
                    return true;
                }
            }

            for (var key in models) {
                if (!(key in protos)) {
                    return true;
                }
            }

            return false;
        }

        public containsCollection(collections: Hash<any>, query: (value: any) => boolean, cache: Hash<boolean>): boolean {
            var of = <CollectionDescriptor>this.of;

            for (var i in collection) {
                var collection = collections[i];

                if (collection && of.contains(collection, query, cache)) return true
            }

            return false;
        }

        public containsTerminalAtom(models: Hash<Version>, query: (value: any) => boolean, cache: Hash<boolean>): boolean {
            for (var i in models) {
                var atom = models[i];

                if (atom && query(atom)) return true;
            }

            return false;
        }

        public containsTerminalReference(references: Hash<Reference>, query: (value: any) => boolean, cache: Hash<boolean>): boolean {
            var of = (<ReferenceDescriptor>this.of).of;

            for (var i in references) {
                var reference = references[i];

                if (reference && of.contains(reference, query, cache)) return true;
            }

            return false;
        }

        public dereferenceCollection(models: Hash<Version>): Hash<Proto> {
            var of = <CollectionDescriptor>this.of;

            var result = <Hash<Proto>><any>{};

            for (var key in models) {
                var model = models[key];

                if (model) {
                    result[key] = of.dereference(model);
                } else {
                    result[key] = <any>model;
                }
            }

            return result;
        }

        public dereferenceTerminalAtom(models: Hash<Version>): Hash<Proto> {
            var result = <Hash<Proto>><any>{};

            for (var key in models) {
                result[key] = <any>models[key];
            }

            return result;
        }

        public dereferenceTerminalReference(models: Hash<Reference>): Hash<string> {
            var result = <Hash<string>><any>{};

            for (var key in models) {
                var model = models[key];

                if (model) {
                    result[key] = model.$rid;
                } else {
                    result[key] = <any>model;
                }
            }

            return result;
        }
    }

    export class TerminalDescriptor extends TypeDescriptor {
        constructor(repo: Repo, tableDescriptor: TableDescriptor, propertyDescriptor: PropertyDescriptor, type: Type) {
            super(repo, tableDescriptor, propertyDescriptor, type)
        }
    }

    export class AtomDescriptor extends TerminalDescriptor {
        private _index: Index;

        constructor(repo: Repo, tableDescriptor: TableDescriptor, propertyDescriptor: PropertyDescriptor, indexConfiguration: IndexConfiguration) {
            super(repo, tableDescriptor, propertyDescriptor, Type.Atom);

            this._index = new Index(indexConfiguration);
        }

        public export(version: Version, model: any): any {
            if (version) {
                var typeString = toString.call(version);

                if (typeString === '[object Object]' || typeString === '[object Array]') {
                    return JSON.parse(JSON.stringify(version));
                }
            }

            return version;
        }

        public import(version: Version, model: any): any {
            if (model) {
                var typeString = toString.call(version);

                if (typeString === '[object Object]' || typeString === '[object Array]') {
                    return JSON.parse(JSON.stringify(model));
                }
            }

            return model;
        }

        public index(reference: Reference, $vid: string, value: any): void {
            this._index.add(reference, $vid, value);
        }

        public deindex($vid: string): void {
            this._index.remove($vid);
        }

        public intersect(query: string, intersection: Hash<SearchResult>, fn: (searchResult: SearchResult) => any): any {
            return this._index.intersect(query, intersection, (score: number, document: Document) => {
                return fn({
                    score: score,
                    value: document.$value,
                    $vid: document.$vid,
                    reference: document.$reference
                });
            });
        }
    }

    export class ReferenceDescriptor extends TerminalDescriptor {
        constructor(repo: Repo, tableDescriptor: TableDescriptor, propertyDescriptor: PropertyDescriptor, public of: TableDescriptor) {
            super(repo, tableDescriptor, propertyDescriptor, Type.Reference);
        }

        public recursiveSearchToken(token: string, cache: Hash<Hash<SearchResult>>): SearchResults {
            return this.of.recursiveSearchToken(token, cache);
        }

        public export(reference: Reference, model: any): any {
            if (reference) {
                return reference.$rid;
            }

            return reference;
        }

        public import(version: Version, reference: any): any {
            if (reference) {
                var repo = this.repo;
                var tableDescriptor = this.of;
                var $table = tableDescriptor.name;

                var $rid: string = reference instanceof Reference ? (<Reference>reference).$rid : reference;

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

                // return repo.createReference($table, $rid); // The reference was deleted or there is no access to it
            }

            return reference;
        }
    }

    export class PropertyDescriptor {
        public typeDescriptor: TypeDescriptor;

        constructor(public repo: Repo, public parent: TableDescriptor, public name: string, typeDeclaration: PropertyDeclaration, descriptorCache: DescriptorCache) {
            this.typeDescriptor = TypeDescriptor.fromRecord(repo, parent, this, typeDeclaration, descriptorCache);
        }

        public index(reference: Reference, $vid: string, value: any): void {
            this.typeDescriptor.index(reference, $vid, value);
        }

        public deindex($vid: string): void {
            this.typeDescriptor.deindex($vid);
        }

        public intersect(query: string, intersection: Hash<SearchResult>, fn: (searchResult: SearchResult) => any): any {
            return this.typeDescriptor.intersect(query, intersection, fn);
        }

        public export(version: Version, model: any): void {
            return this.typeDescriptor.export(version, model);
        }

        public import(version: Version, model: any): void {
            return this.typeDescriptor.import(version, model);
        }
    }

    export class TableDescriptor {
        public properties: Hash<PropertyDescriptor>;
        public propertiesArray: List<PropertyDescriptor>;

        public atomProperties: PropertyDescriptor[];
        public referenceProperties: PropertyDescriptor[];

        public hashProperties: PropertyDescriptor[];
        public arrayProperties: PropertyDescriptor[];

        public flatProperties: PropertyDescriptor[];
        public nestedProperties: PropertyDescriptor[];

        public flatAtomProperties: PropertyDescriptor[];
        public flatReferenceProperties: PropertyDescriptor[];

        public nestedAtomProperties: PropertyDescriptor[];
        public nestedReferenceProperties: PropertyDescriptor[];

        public constructor(public repo: Repo, public name: string, private declaration: TableDeclaration) {
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

        public flatSearch(query: string): SearchResults {
            var tokens = query.match(/(?:")(?:(?:[\u00C0-\u1FFF\u2C00-\uD7FF\w]+'[\u00C0-\u1FFF\u2C00-\uD7FF\w]+|['\u00C0-\u1FFF\u2C00-\uD7FF\w]+)[^\u00C0-\u1FFF\u2C00-\uD7FF\w]*)+(?:")|(?:[\u00C0-\u1FFF\u2C00-\uD7FF\w]+'[\u00C0-\u1FFF\u2C00-\uD7FF\w]+|['\u00C0-\u1FFF\u2C00-\uD7FF\w]+)/g) ||  emptyList;

            var properties = this.flatAtomProperties;
            var propertiesLength = properties.length;

            var count = 0, intersectionA: Hash<SearchResult> = null, tokensLength = tokens.length;

            for (var tokenIndex = 0; tokenIndex < tokens.length; tokenIndex++) {
                var token = tokens[tokenIndex], intersectionB: Hash<SearchResult> = { }, count = 0;

                for (var propertyIndex = 0; propertyIndex < propertiesLength; propertyIndex++) {
                    properties[propertyIndex].intersect(token, intersectionA, (searchResult) => {
                        var searchResultCache = intersectionB[searchResult.$vid];

                        if (searchResultCache) {
                            var score = searchResultCache.score;

                            searchResultCache.score += score * score;
                        } else {
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
                results: intersectionA || { }
            };
        }

        public recursiveSearchToken(token: string, cache: Hash<Hash<SearchResult>>): SearchResults {
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

                            var ownersByTable = searchResult.reference.owners[$table]

                            if (ownersByTable) {
                                var ownersByTableByProperty = ownersByTable[propertyName];

                                if (ownersByTableByProperty) {
                                    for (var ownerVersion in ownersByTableByProperty) {
                                        var result = results[ownerVersion];

                                        if (result) {
                                            result.score += searchResult.score
                                        } else {
                                            count++;
                                            results[ownerVersion] = {
                                                score: searchResult.score,
                                                value: searchResult.value,
                                                reference: referenecs[records[ownerVersion].rid],
                                                $vid: ownerVersion
                                            }
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
                            } else {
                                count++;
                                results[searchResult.$vid] = searchResult;
                                searchResult.score *= searchResult.score;
                            }
                        })
                    }
                }
            }

            return {
                count: count,
                results: results
            };
        }

        public recursiveSearch(query: string): SearchResults {
            var tokens = query.match(/(?:")(?:(?:[\u00C0-\u1FFF\u2C00-\uD7FF\w]+'[\u00C0-\u1FFF\u2C00-\uD7FF\w]+|['\u00C0-\u1FFF\u2C00-\uD7FF\w]+)[^\u00C0-\u1FFF\u2C00-\uD7FF\w]*)+(?:")|(?:[\u00C0-\u1FFF\u2C00-\uD7FF\w]+'[\u00C0-\u1FFF\u2C00-\uD7FF\w]+|['\u00C0-\u1FFF\u2C00-\uD7FF\w]+)/g) || emptyList;
            var tokensLength = tokens.length;

            if (tokensLength > 0) {
                var searchResultsA = this.recursiveSearchToken(tokens[0], {});

                for (var tokenIndex = 1; tokenIndex < tokens.length; tokenIndex++) {
                    var searchResultsB = this.recursiveSearchToken(tokens[tokenIndex], { });

                    if (searchResultsA.count < searchResultsB.count) {
                        var intersectionA = searchResultsA.results;
                        var intersectionB = searchResultsB.results;
                    } else {
                        var intersectionA = searchResultsB.results;
                        var intersectionB = searchResultsA.results;
                    }

                    var intersectionC: Hash<SearchResult> = {};
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
        }

        public initializeDeclaration(repo: Repo, propertyName: string, propertyDeclaration: PropertyDeclaration, descriptorCache: DescriptorCache) {
            var propertyDescriptor = new PropertyDescriptor(repo, this, propertyName, propertyDeclaration, descriptorCache);

            this.propertiesArray.push(propertyDescriptor);
            this.properties[propertyDescriptor.name] = propertyDescriptor;

            var typeDescriptor = propertyDescriptor.typeDescriptor;

            switch (typeDescriptor.type) {

                case Type.Atom:
                    this.atomProperties.push(propertyDescriptor);
                    this.flatProperties.push(propertyDescriptor);
                    this.flatAtomProperties.push(propertyDescriptor);
                    break;

                case Type.Hash:
                    this.hashProperties.push(propertyDescriptor);
                    this.nestedProperties.push(propertyDescriptor);

                    var baseTypeDescriptor = (<HashDescriptor>typeDescriptor).baseType;

                    switch (baseTypeDescriptor.type) {
                        case Type.Atom:
                            this.atomProperties.push(propertyDescriptor);
                            this.nestedAtomProperties.push(propertyDescriptor);
                            break;
                        case Type.Reference:
                            this.referenceProperties.push(propertyDescriptor);
                            this.nestedReferenceProperties.push(propertyDescriptor);
                            break;
                    }
                    break;

                case Type.Array:
                    this.arrayProperties.push(propertyDescriptor);
                    this.nestedProperties.push(propertyDescriptor);

                    var baseTypeDescriptor = (<ArrayDescriptor>typeDescriptor).baseType;

                    switch (baseTypeDescriptor.type) {
                        case Type.Atom:
                            this.atomProperties.push(propertyDescriptor);
                            this.nestedAtomProperties.push(propertyDescriptor);
                            break;
                        case Type.Reference:
                            this.referenceProperties.push(propertyDescriptor);
                            this.nestedReferenceProperties.push(propertyDescriptor);
                            break;
                    }
                    break;

                case Type.Reference:
                    this.flatProperties.push(propertyDescriptor);
                    this.flatReferenceProperties.push(propertyDescriptor);

                    this.referenceProperties.push(propertyDescriptor);
                    break;

                default:
                    ThrowInvalidOperationException();
            }
        }

        public initialize(descriptorCache: DescriptorCache) {
            var declaration = this.declaration;

            for (var propertyName in declaration) {
                this.initializeDeclaration(this.repo, propertyName, declaration[propertyName], descriptorCache);
            }
        }

        public reference(references: Hash<Reference>, ownerRecord: Record, model: Version): void {
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
                var referenceString = <string>model[property.name];

                if (referenceString) {
                    var reference = model[propertyName] = (references[referenceString] || (references[referenceString] = new Reference(this.repo, referenceString, (<ReferenceDescriptor>property.typeDescriptor).of.name)));
                    var ownerProperties = reference.owners[$table] || (reference.owners[$table] = <OwnerProperties><any>{});
                    var ownerTable = ownerProperties[propertyName] || (ownerProperties[propertyName] = <OwnerTable><any>{});

                    ownerTable[$vid] = model;
                }
            }

            var properties = this.nestedReferenceProperties;
            var count = properties.length;

            for (var i = 0; i < count; i++) {
                var property = properties[i];

                var referenceCollection = model[property.name];

                if (referenceCollection) {
                    (<CollectionDescriptor><any>property.typeDescriptor).reference(references, ownerRecord, model, referenceCollection);
                }
            }
        }

        public cleanup(references: Hash<Reference>, record: Record, model: Version) {
            var $vid = record.vid;
            var $table = record.table;

            properties = this.flatReferenceProperties;
            count = properties.length;

            for (var i = 0; i < count; i++) {
                var property = properties[i];
                var propertyName = property.name;

                var reference = <Reference>model[property.name];

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
                        } else {
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

                var referenceCollection = <Reference>model[property.name];

                if (referenceCollection) {
                    (<CollectionDescriptor><any>property.typeDescriptor).cleanup(references, record, referenceCollection);
                }
            }

            var properties = this.flatAtomProperties;
            var count = properties.length;

            for (var i = 0; i < count; i++) {
                var property = properties[i];
                property.deindex($vid);
            }
        }

        public checkout(records: Hash<Record>, model: Version, cache: Hash<Version>, result: List<Record>): void {
            var properties = this.flatReferenceProperties;
            var length = properties.length;

            for (var i = 0; i < length; i++) {
                var property = properties[i];
                var propertyValue = <Reference>model[property.name];
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
                var propertyValue = <Reference>model[property.name];
                if (propertyValue) {
                    (<CollectionDescriptor>property.typeDescriptor).checkout(records, propertyValue, cache, result);
                }
            }
        }

        public contains(reference: Reference, query: (value) => boolean, cache: Hash<boolean>): boolean {
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
                            if (query(version[propertyName])) return cache[reference.$rid] = true;
                        }
                    }

                    properties = this.flatReferenceProperties;
                    propertiesLength = properties.length;

                    for (var i = 0; i < propertiesLength; i++) {
                        var property = properties[i];
                        var propertyName = property.name;

                        if (propertyName in version) {
                            if ((<ReferenceDescriptor>property.typeDescriptor).of.contains(version[propertyName], query, cache)) return cache[reference.$rid] = true;
                        }
                    }

                    properties = this.nestedProperties;
                    propertiesLength = properties.length;

                    for (var i = 0; i < propertiesLength; i++) {
                        var property = properties[i];
                        var propertyName = property.name;

                        if (propertyName in version) {
                            if ((<CollectionDescriptor>property.typeDescriptor).contains(version[propertyName], query, cache)) return cache[reference.$rid] = true;
                        }
                    }
                }
            }

            return cache[reference.$rid] = false;
        }

        public clone(record: Record, reference: Reference): Version {
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
                    var propertyValue = <Reference>proto[propertyName];

                    if (propertyValue) {
                        result[propertyName] = (<CollectionDescriptor>property.typeDescriptor).clone(propertyValue);
                    } else {
                        result[propertyName] = propertyValue;
                    }
                }
            }

            return result;
        }

        public changed(model: Version, proto: Proto): boolean {
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
                        if ((<Reference>model[propertyName]).$rid !== proto[propertyName]) {
                            return true;
                        }
                    } else if (modelValue !== proto[propertyName]) { // null !== undefined or vice versa
                        return true;
                    }
                } else if (inModel || inProto) {
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
                        if ((<CollectionDescriptor>property.typeDescriptor).changed(modelValue, protoValue)) {
                            return true;
                        }
                    } else if (modelValue || protoValue || modelValue !== protoValue) {
                        return true;
                    }
                } else if (inModel || inProto) {
                    return true;
                }
            }

            return false;
        }

        public dereference(model: Version): Proto {
            var result = <Proto>{};

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
                    var modelValue = <Reference>model[propertyName];
                    if (modelValue) {
                        result[propertyName] = modelValue.$rid;
                    } else {
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
                    var propertyValue = <Reference>model[propertyName];

                    if (propertyValue) {
                        result[propertyName] = (<CollectionDescriptor>property.typeDescriptor).dereference(propertyValue);
                    } else {
                        result[propertyName] = propertyValue;
                    }
                }
            }

            return result;
        }
    }

    export class Pipeline {
        public static defaultStopWords: Hash<boolean> = (function (array:string[]):Hash<boolean> {
            var result:Hash<boolean> = {};
            for (var i = 0; i < array.length; ++i) result[array[i]] = true;
            return result;
        })(["a", "about", "above", "across", "after", "afterwards", "again", "against", "all", "almost", "alone", "along", "already",
            "also", "although", "always", "am", "among", "amongst", "amoungst", "amount", "an", "and", "another", "any", "anyhow", "anyone", "anything", "anyway",
            "anywhere", "are", "around", "as", "at", "back", "be", "became", "because", "become", "becomes", "becoming", "been", "before", "beforehand", "behind",
            "being", "below", "beside", "besides", "between", "beyond", "bill", "both", "bottom", "but", "by", "call", "can", "cannot", "cant", "co", "con",
            "could", "couldnt", "cry", "de", "describe", "detail", "do", "done", "down", "due", "during", "each", "eg", "eight", "either", "eleven", "else",
            "elsewhere", "empty", "enough", "etc", "even", "ever", "every", "everyone", "everything", "everywhere", "except", "few", "fifteen", "fify", "fill",
            "find", "fire", "first", "five", "for", "former", "formerly", "forty", "found", "four", "from", "front", "full", "further", "get", "give", "go", "had",
            "has", "hasnt", "have", "he", "hence", "her", "here", "hereafter", "hereby", "herein", "hereupon", "hers", "herself", "him", "himself", "his", "how",
            "however", "hundred", "ie", "if", "in", "inc", "indeed", "interest", "into", "is", "it", "its", "itself", "keep", "last", "latter", "latterly",
            "least", "less", "ltd", "made", "many", "may", "me", "meanwhile", "might", "mill", "mine", "more", "moreover", "most", "mostly", "move", "much",
            "must", "my", "myself", "name", "namely", "neither", "never", "nevertheless", "next", "nine", "no", "nobody", "none", "noone", "nor", "not", "nothing",
            "now", "nowhere", "of", "off", "often", "on", "once", "one", "only", "onto", "or", "other", "others", "otherwise", "our", "ours", "ourselves", "out",
            "over", "own", "part", "per", "perhaps", "please", "put", "rather", "re", "same", "see", "seem", "seemed", "seeming", "seems", "serious", "several",
            "she", "should", "show", "side", "since", "sincere", "six", "sixty", "so", "some", "somehow", "someone", "something", "sometime", "sometimes",
            "somewhere", "still", "such", "system", "take", "ten", "than", "that", "their", "them", "themselves", "then", "thence", "there", "thereafter",
            "thereby", "therefore", "therein", "thereupon", "these", "they", "thickv", "thin", "third", "this", "those", "though", "three", "through",
            "throughout", "thru", "thus", "to", "together", "too", "top", "toward", "towards", "twelve", "twenty", "two", "un", "under", "until", "up", "upon",
            "us", "very", "via", "was", "we", "well", "were", "what", "whatever", "when", "whence", "whenever", "where", "whereafter", "whereas", "whereby",
            "wherein", "whereupon", "wherever", "whether", "which", "while", "whither", "who", "whoever", "whole", "whom", "whose", "why", "will", "with",
            "within", "without", "would", "yet", "you", "your", "yours", "yourself", "yourselves", "the"]);

        public static defaultTokenizerRegexp: RegExp = /[\u00C0-\u1FFF\u2C00-\uD7FF\w]+'[\u00C0-\u1FFF\u2C00-\uD7FF\w]+|['\u00C0-\u1FFF\u2C00-\uD7FF\w]+/ig;
        public static defaultStopWordsFilter(stopWords: Hash<boolean>): (values: string[]) => string[] {
            return function (tokens: string[]): string[] {
                var count = tokens.length;

                for (var index = 0, capacity = 0; index < count; index++) {
                    var token = tokens[index];

                    if (!(token in stopWords)) {
                        tokens[capacity++] = token;
                    }
                }

                tokens.length = capacity;

                return tokens;
            }
        }

        public static defaultTokenizer(regexp: RegExp): (value: any)=>string[] {
            return function (value: any): string[] {
                return String(value).toLowerCase().match(regexp) || emptyList
            };
        }

        public static defaultStemmer(stemmer): (tokens: string[]) => string[]{
            return function (tokens: string[]): string[] {
                var count = tokens.length;

                for (var index = 0; index < count; index++) {
                    tokens[index] = stemmer(tokens[index]);
                }

                return tokens;
            }
        }
    }

    export class Repo {
        public records: Hash<Record>;
        public creates: Hash<Version>;
        public deletes: Hash<Version>;
        public versions: Hash<Version>;

        public descriptors: TableDescriptors;
        public declarations: Hash<TableDeclaration>;

        public tables: Tables;
        public tableChanged: Hash<List<any>>;
        public tableChanging: Hash<List<any>>;

        public references: Hash<Reference>;
        public referenceChanged: Hash<List<any>>;
        public referenceChanging: Hash<List<any>>;

        public constructor(declarations?: Hash<TableDeclaration>, public defaultIndexConfiguration?: string, public indexConfigurations?: IndexConfigurations) {
            var me = this;

            me.indexConfigurations = me.indexConfigurations || {};
            me.defaultIndexConfiguration = me.defaultIndexConfiguration || 'default';

            me.indexConfigurations[me.defaultIndexConfiguration] = me.indexConfigurations[me.defaultIndexConfiguration] || (function () {
                    return {
                        insertPipeline: [Pipeline.defaultTokenizer(Pipeline.defaultTokenizerRegexp)],
                        searchPipeline: [Pipeline.defaultTokenizer(Pipeline.defaultTokenizerRegexp)]
                    };
                })();

            me.tables = <Tables><any>{};
            me.records = <Hash<Record>><any>{};
            me.creates = <Hash<Version>><any>{};
            me.deletes = <Hash<Version>><any>{};
            me.versions = <Hash<Version>><any>{};
            me.references = <Hash<Reference>><any>{};

            me.tableChanged = <Hash<List<any>>><any>{};
            me.tableChanging = <Hash<List<any>>><any>{};

            me.referenceChanged = <Hash<List<any>>><any>{};
            me.referenceChanging = <Hash<List<any>>><any>{};

            if (declarations) me.migrate(declarations);
        }

        public search(query: string, $table?: string, propertyName?: string): SearchResult[]{
            var results: SearchResults;

            if (arguments.length) {
                if (arguments.length === 1) {
                    var searchResultsCount: number = 0;
                    var searchResults: Hash<SearchResult> = {};
                    var descriptors = this.descriptors;

                    for (var tableDescriptorName in descriptors) {
                        var tableDescriptor = descriptors[tableDescriptorName];

                        var union = tableDescriptor.recursiveSearch(query).results;

                        for (var $vid in union) {
                            var value = union[$vid];
                            var searchResult = searchResults[$vid];

                            if (searchResult) {
                                searchResult.score += value.score;
                            } else {
                                searchResultsCount++;
                                searchResults[$vid] = value;
                            }
                        }
                    }

                    results = {
                        count: searchResultsCount,
                        results: searchResults
                    };
                } else if (arguments.length === 2) {
                    results = this.descriptors[$table].recursiveSearch(query);
                } else {
                    var searchResultsCount: number = 0;
                    var searchResults: Hash<SearchResult> = {};

                    var property = this.descriptors[$table].properties[propertyName];

                    var typeDescriptor = property.typeDescriptor;
                    var baseTypeDescriptor = typeDescriptor instanceof CollectionDescriptor ? (<CollectionDescriptor>typeDescriptor).baseType : typeDescriptor;

                    if (baseTypeDescriptor.type === Type.Atom) {
                        property.intersect(query, null, function (searchResult) {
                            searchResultsCount++;
                            searchResults[searchResult.$vid] = searchResult;
                        });
                    } else if (baseTypeDescriptor.type === Type.Reference) {
                        results = (<ReferenceDescriptor>baseTypeDescriptor).of.recursiveSearch(query);
                    }
                    results = {
                        count: searchResultsCount,
                        results: searchResults
                    };
                }
            } else {
                results = {
                    count: 0,
                    results: { }
                }
            }

            var index = 0;
            var result: SearchResult[] = [];
            var resultsHash = results.results;

            result.length = results.count;

            for (var key in resultsHash) {
                result[index++] = resultsHash[key];
            }

            result.sort(function (a, b) {
                return b.score - a.score;
            });

            return result;
        }

        public find(references: any, $table: string, query: (value: any) => boolean, itemCallback: (reference: Reference, isFound: boolean) => void, cache: Hash<boolean>): void {
            if (references) {
                var table = this.descriptor($table);

                cache = cache || <Hash<boolean>><any>{};

                if (toString.call(references) === '[object Array]') {
                    var length = references.length;

                    for (var i = 0; i < length; i++) {
                        var reference = <Reference>references[i];

                        itemCallback(reference, table.contains(reference, query, cache));
                    }
                } else {
                    for (var key in references) {
                        var reference = <Reference>references[key];

                        itemCallback(reference, table.contains(reference, query, cache));
                    }
                }
            }
        }

        public descriptor(name: string): TableDescriptor {
            return this.descriptors[name] || Throw('Descriptor "' + name + '" not found');
        }

        public checkout(reference: Reference): List<Record>;
        public checkout(referenceOrVersion: string): List<Record>;
        public checkout(...idsOrVersionsOrReferences: Object[]): List<Record>;
        public checkout(idsOrVersionsOrReferences: Object[]): List<Record>;
        public checkout(idsOrVersionsOrReferences: Object): List<Record> {
            var cache = <Hash<Version>><any>{};
            var result = <List<Record>><any>[];

            var records = this.records;
            var references = this.references;
            var tableDescriptors = this.descriptors;

            var preprocessReference = function (reference: Reference) {
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
                        preprocessReference(<Reference>argument)
                    } else if (argument instanceof Version) {
                        var $vid = (<Version>argument).$vid;
                        if (!($vid in cache)) {
                            result.push(records[$vid]);
                            cache[$vid] = <Version>argument;
                        }
                    } else if (typeof argument == 'string' || argument instanceof String) {
                        if (argument in records) {
                            if (!(argument in cache)) {
                                var record = records[argument];
                                result.push(record);
                                cache[argument] = references[record.rid].versions[record.vid];
                            }
                        } else if (argument in references) {
                            preprocessReference(references[argument]);
                        } else {
                            Throw('Id "' + argument + '" not found');
                        }
                    } else if (toString.call(argument) === '[object Array]') {
                        preprocessArguments.apply(this, argument);
                    } else if (toString.call(argument) === '[object Object]') {
                        foreach(argument, function (nested) {
                            preprocessArguments.call(this, nested);
                        });
                    } else {
                        Throw('Unexpected argument type');
                    }
                });
            };

            preprocessArguments.apply(this, arguments);

            for (var i = 0; i < result.length; i++) { // `result` capacity can change during iteration
                var record = result[i];

                tableDescriptors[record.table].checkout(records, cache[record.vid], cache, result);
            }

            return result;
        }

        public diff() {
            var creates = this.creates;
            var deletes = this.deletes;
            var records = this.records;
            var references = this.references;
            var tableDescriptors = this.descriptors;

            var results = <List<Record>><any>[];

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
                        results.push(<Record>{
                            rid: record.rid,
                            vid: inCreates ? null : record.vid,

                            table: record.table,
                            pid: record.pid,

                            createdOn: record.createdOn,
                            updatedOn: record.updatedOn
                        });
                    } else {
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
        }

        private static fireTableEvents(tableDescriptor: TableDescriptor, eventHandlersHash: Hash<List<any>>) {
            var $table = tableDescriptor.name;
            var eventHandlers = eventHandlersHash[$table];

            if (eventHandlers) {
                var length = eventHandlers.length;
                for (var i = 0; i < length; i++) {
                    eventHandlers[i]($table, tableDescriptor);
                }
            }
        }

        public merge(items: List<Record>): void {
            var tables = this.tables;
            var records = this.records;
            var versions = this.versions;
            var references = this.references;
            var tableDescriptors = this.descriptors;

            var tableChanged = this.tableChanged;
            var tableChanging = this.tableChanging;
            var referenceChanged = this.referenceChanged;
            var referenceChanging = this.referenceChanging;

            var changedTables = <List<TableDescriptor>><any>{};
            var changedReferences = <List<TableDescriptor>><any>{};

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
                        } else {
                            reference = tables[table][$rid] = references[$rid] = new Reference(this, $rid, record.table);
                            versions[$vid] = reference.versions[$vid] = tableDescriptor.clone(record, reference);
                        }

                        records[$vid] = record;
                    }

                    // If there is subscription to referenceChanged event for this reference, then add it to a list
                    if ($rid in referenceChanged) {
                        changedReferences[$rid] = tableDescriptor;
                    }
                } else {
                    Throw('Table "' + table + '" not found')
                }
            }

            for (var i = 0; i < length; i++) {
                var record = items[i];

                if (record.proto) {
                    tableDescriptors[record.table].reference(references, record, references[record.rid].versions[record.vid]);
                } else {
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
                        if (isEmpty(reference.owners) && isEmpty(reference.versions)) { // There are no versions left, the object is not being referenced by other object
                            delete references[$rid];
                            delete tables[record.table][$rid];
                        }

                        tableDescriptors[record.table].cleanup(references, record, version);
                    }
                }
            }

            // ---------------- reference changed event handling logic ----------------
            for (var key in changedReferences) {
                var tableDescriptor = changedReferences[key];
                var referenceChangedCallbacks = referenceChanged[key];
                var referenceChangedCallbacksLength = referenceChangedCallbacks.length;

                for (var i = 0; i < referenceChangedCallbacksLength; i++) {
                    referenceChangedCallbacks[i](key, references[key], tableDescriptor); // references[key] may be undefined
                }
            }
            // ---------------- reference changed event handling logic ----------------

            for (var key in changedTables) {
                Repo.fireTableEvents(changedTables[key], tableChanged);
            }
        }

        public migrate(declarations: Hash<TableDeclaration>) {
            var self = this;
            var descriptors = this.descriptors = <TableDescriptors><any>{};
            var descriptorCache = <TableDescriptors><any>{};

            var descriptorCacheFn = function (name): TableDescriptor {
                var declaration = name;

                while (toString.call(declaration) === '[object String]') {
                    declaration = declarations[declaration] || Throw('Descriptor "' + declaration + '" not found');

                    if (declaration === name) {
                        Throw('Recursive type declaration of type "' + name + '"');
                    }
                }

                if (name in descriptorCache) {
                    return descriptorCache[name];
                } else {
                    var descriptor = descriptorCache[name] = new TableDescriptor(self, name, declaration);

                    descriptor.initialize(<any>descriptorCacheFn);

                    return descriptor;
                }
            };

            for (var $table in declarations) {
                descriptors[$table] = descriptorCacheFn($table);
            }

            var tables = this.tables;

            for (var $table in declarations) {
                tables[$table] = tables[$table] || <Table><any>{};
            }

            this.declarations = declarations;
        }

        public createVersion(reference: Reference, $vid: string, $pid: string, model?: any): Version {
            if (reference) {
                var now = (new Date()).getTime();

                var record = this.records[$vid] = <Record>{
                    vid: $vid,

                    rid: reference.$rid,
                    table: reference.table,

                    pid: $pid,

                    proto: null, // Record always contains previous version, in case when a new object is created, a previous version is null obviously

                    createdOn: now,
                    updatedOn: now
                };

                var version = this.creates[$vid] = reference.versions[$vid] = new Version($vid, $vid, reference.$rid, reference);

                this.import(reference.table, version, model);

                return version;
            } else {
                return Throw('Argument "reference" is empty');
            }
        }

        public createReference($rid: string, $table: string): Reference {
            if ($table in this.descriptors) {
                return this.references[$rid] || (this.references[$rid] = new Reference(this, $rid, $table)); // Get or create a reference
            } else {
                return Throw('Table name "' + $table + '" not found');
            }
        }

        public remove($vid: string): Version;
        public remove($rid: string): Reference;
        public remove(version: Version): Version;
        public remove(reference: Reference): Reference;
        public remove(value: any): any {
            var $vid: string;

            if (value instanceof Reference) {
                var referenceVersions = (<Reference>value).versions;

                for ($vid in referenceVersions) {
                    this.deletes[$vid] = referenceVersions[$vid];

                    delete referenceVersions[$vid];
                }

                return value;
            } else if (value instanceof Version) {
                var reference = (<Version>value).$;
                var referenceVersions = reference.versions;

                $vid = (<Version>value).$vid;

                this.deletes[$vid] = referenceVersions[$vid];

                delete referenceVersions[$vid];

                return value;
            } else if (<string>value in this.records) {
                var record = this.records[<string>value];
                var reference = this.references[record.rid];
                var referenceVersions = reference.versions;
                var version = referenceVersions[value];

                this.deletes[value] = version;

                delete referenceVersions[value];

                return version;
            } else if (<string>value in this.references) {
                var reference = this.references[<string>value];
                var referenceVersions = reference.versions;

                for ($vid in referenceVersions) {
                    this.deletes[$vid] = referenceVersions[$vid];
                    delete referenceVersions[$vid];
                }

                return reference;
            } else {
                Throw('Value "' + value + '" not found in repository');
            }
        }

        public unremove($vid: string): void {
            if ($vid in this.records) {
                var record = this.records[$vid];
                var reference = this.references[record.rid];
                var versions = reference.versions;

                versions[$vid] = this.deletes[$vid];

                delete this.deletes[$vid];
            } else {
                Throw('Version "' + $vid + '" not found');
            }
        }

        public on(event, references: List<string>, callback: any);
        public on(event, references: Hash<string>, callback: any);
        public on(event, references: List<Reference>, callback: any);
        public on(event, references: Hash<Reference>, callback: any);
        public on(event, referenceId: string, callback: any);
        public on(event, reference: Reference, callback: any);
        public on(event, value: any, callback: any) {
            var i, key, length, values, handlers = toString.call(event) == '[object String]' ? this[event] : event;

            switch (toString.call(value)) {
                case '[object Array]':
                    values = value;
                    length = values.length;

                    for (i = 0; i < length; i++) {
                        value = values[i];
                        if (toString.call(value) === '[object String]') {
                            (handlers[value] || (handlers[value] = <List<any>><any>[])).push(callback);
                        } else { // Reference
                            value = (<Reference>value).$rid;
                            (handlers[value] || (handlers[value] = <List<any>><any>[])).push(callback);
                        }
                    }
                    break;
                case '[object String]':
                    (handlers[value] || (handlers[value] = <List<any>><any>[])).push(callback);
                    break;
                default:
                    if (value instanceof Reference) {
                        value = (<Reference>value).$rid;
                        (handlers[value] || (handlers[value] = <List<any>><any>[])).push(callback);
                    } else {
                        values = value;

                        for (key in values) {
                            value = values[key];

                            if (toString.call(value) === '[object String]') {
                                (handlers[value] || (handlers[value] = <List<any>><any>[])).push(callback);
                            } else { // Reference
                                value = (<Reference>value).$rid;
                                (handlers[value] || (handlers[value] = <List<any>><any>[])).push(callback);
                            }
                        }
                    }
                    break;
            }
        }

        public export($table: string, version: Version, model?: any) : any {
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
                    } else {
                        delete model[propertyName];
                    }
                }

                model.$vid = version.$vid;
            }

            return model;
        }

        public import($table: string, version: Version, model?: any) : Version {
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
                    } else {
                        delete version[propertyName];
                    }
                }
            }

            return version;
        }

        public clone(): Repo;
        public clone(reference: Reference): Repo;
        public clone(referenceOrVersion: string): Repo;
        public clone(...idsOrVersionsOrReferences: Object[]): Repo;
        public clone(idsOrVersionsOrReferences: Object[]): Repo;
        public clone(idsOrVersionsOrReferences?: Object): Repo
        {
            var clone = new Repo(this.declarations, this.defaultIndexConfiguration, this.indexConfigurations);

            if (arguments.length > 0) {
                var diff = this.checkout(idsOrVersionsOrReferences);

                clone.merge(diff);
            }

            return clone;
        }
    }
}