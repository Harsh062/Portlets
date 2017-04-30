/**
 * Created by Harsh on 24/04/2017.
 */
'use strict';

var app = angular.module('orgStructureApp', []);
app.controller('orgStructureController', ['$scope', 'getLocalStorage', function($scope, getLocalStorage) {

    var sampleOrgData = [{
        "_id": "CEO",
        "depth": 0,
        "name": "Poonacha Machaiah",
        "children": [{
            "_id": "HR Head",
            "depth": 1,
            "name": "Jyothi Machaiah",
            "children": [{
                "_id": "Facilities Manager",
                "depth": 2,
                "name": "Ramesh Gombi",
                "children": [{
                    "_id": "Facilities Lead",
                    "depth": 3,
                    "name": "Shaila Kumar"
                }]
            }, {
                "_id": "Talent Acquisition Manager",
                "depth": 2,
                "name": "Amar Jyoti Paul",
                "children": [{
                    "_id": "Talent Acquisition Lead",
                    "depth": 3,
                    "name": "Guru Morasa"
                }, {
                    "_id": "Campus Recruitment Lead",
                    "depth": 3,
                    "name": "Anuradha Paul"
                }]
            }]
        }, {
            "_id": "Engineering Head",
            "depth": 1,
            "name": "Chakravarthy Meduri",
            "children": [{
                "_id": "Services Project Manager",
                "depth": 2,
                "name": "Sunil Datta Kulkarni"
            }, {
                "_id": "Jiyo Product Manager",
                "depth": 2,
                "name": "Rajeshwari S"
            }]
        }, {
            "_id": "Business Head",
            "depth": 1,
            "name": "Raghav Kamran",
            "children": [{
                "_id": "Business Operations",
                "depth": 2,
                "name": "Shatabdi M"
            }, {
                "_id": "Sales & Marketing",
                "depth": 2,
                "name": "Mandanna"
            }]
        }]
    }];

    // add new node at top level here
    $scope.isAddExamNode = false;
    $scope.addNewNodeAtRootLevel = function() {
        $scope.isAddExamNode = true;
        var newNode = {
            name: "New Node",
            id: "",
            level: 0,
            parent: "root",
            toggleStatus: false,
            parentId: -1,
            isShow: true,
            isEditable: false,
            childCount: 0,
            isSaveBtn: false,
            isShowMessage: false,
            type: "organisation"
        };
        $scope.nodesTableArr.unshift(newNode);
        console.log('$scope.nodesTableArr after adding new node at root level', $scope.nodesTableArr);
        localStorage.setItem("orgData", JSON.stringify($scope.nodesTableArr));
    };

    // add new node.
    $scope.operationStatusMessage = "";
    $scope.currentNodeSelected = {};
    var uniqueIdForNewNodes = 0;
    $scope.addChildNode = function(node) {
        // add row to table.
        $scope.operationStatusMessage = "";
        $scope.currentNodeSelected = node;
        for (var i = 0; i < $scope.nodesTableArr.length; i++) {
            if ($scope.nodesTableArr[i].id === node.id) {
                $scope.nodesTableArr.splice(i + 1, 0, {
                    name: "New Node",
                    id: uniqueIdForNewNodes,
                    level: node.level + 1,
                    parent: node.name,
                    toggleStatus: false,
                    parentId: node.id,
                    isShow: true,
                    isEditable: false,
                    childCount: 0,
                    isSaveBtn: false,
                    isShowMessage: false,
                    type: "nonExam"
                });
                break;
            }
        }
        uniqueIdForNewNodes += 1;
        console.log('$scope.nodesTableArr after adding child node', $scope.nodesTableArr);
        localStorage.setItem("orgData", JSON.stringify($scope.nodesTableArr));
    };

    $scope.saveNewNode = function(node) {
        alert("You can save the node in local storage");
        $scope.saveNewNodeCB();
    };

    $scope.saveNewNodeCB = function() {
        $scope.resetOperationStatusMessage();
        $scope.operationStatusMessage = "Node Saved Successfully";
        $scope.currentNodeSelected.isShowMessage = true;
        $scope.currentNodeSelected.isSaveBtn = false;

        // update node id in newly added node object, so that if we add new node under it, it has its valid parent id.
        for (var i = 0; i < $scope.nodesTableArr.length; i++) {
            var node = $scope.nodesTableArr[i];
            if (node == $scope.conceptNodeToAdd)
                node.id = response.data.node;
        }
        alert("send request to server here to save this node.");
        console.log('$scope.nodesTableArr after saving node', $scope.nodesTableArr);
        localStorage.setItem("orgData", JSON.stringify($scope.nodesTableArr));
    };

    $scope.editNode = function(node) {
        $scope.nodeNameInOperation = node.name;
        $scope.operationStatusMessage = "";
        $scope.currentNodeSelected = node;
        var nodeName = prompt("Please enter New node Name", node.name);
        if (nodeName != "" && nodeName != null && node.name != undefined && nodeName != node.name) {
            node.name = nodeName;
            if (node.id != "") {
                node.isUpdateBtn = true;
            } else {
                node.isSaveBtn = true;
            }
        }
        console.log('$scope.nodesTableArr after editing', $scope.nodesTableArr);
        localStorage.setItem("orgData", JSON.stringify($scope.nodesTableArr));
    };

    $scope.updateNode = function(node) {
        alert("You can send request on server to update this node.");
        $scope.updateNodeCB();
    };

    $scope.updateNodeCB = function(response) {

        $scope.resetOperationStatusMessage();
        $scope.currentNodeSelected.isShowMessage = true;
        $scope.operationStatusMessage = "node Updated Successfully";
        $scope.currentNodeSelected.isUpdateBtn = false;
        console.log('$scope.nodesTableArr after updating', $scope.nodesTableArr);
        localStorage.setItem("orgData", JSON.stringify($scope.nodesTableArr));
    };

    // nodeType = concept/nonConcept
    $scope.nodeToDelete = {};
    $scope.deleteNode = function(node, nodeType) {

        $scope.nodeNameInOperation = node.name;
        $scope.nodeTypeForMessage = nodeType;
        $scope.nodeToDelete = node;
        $scope.operationStatusMessage = "";
        $scope.currentNodeSelected = node;
        var message;
        if (node.id == "") {
            for (var i = 0; i < $scope.nodesTableArr.length; i++) {
                if ($scope.nodesTableArr[i] == $scope.currentNodeSelected)
                    $scope.nodesTableArr.splice(i, 1);
            }
            return 0;
        }
        var r = confirm("Warning! Be Carefull! On deletion all nodes under this node will be deleted.\nPress ok to delete node");
        if (r == true) {
            $scope.deleteNodeCB();
        }
        $scope.curPageNo = 1;
    };

    $scope.deleteNodeCB = function() {

        $scope.resetOperationStatusMessage();
        $scope.operationStatusMessage = "node deleted Successfully";
        $scope.currentNodeSelected.isShowMessage = true;

        for (var i = 0; i < $scope.nodesTableArr.length; i++) {
            if ($scope.nodesTableArr[i] == $scope.currentNodeSelected)
                $scope.nodesTableArr.splice(i, 1);
        }
        console.log('$scope.nodesTableArr after deleting', $scope.nodesTableArr);
        localStorage.setItem("orgData", JSON.stringify($scope.nodesTableArr));
    };

    $scope.resetOperationStatusMessage = function() {
        for (var i = 0; i < $scope.nodesTableArr.length; i++) {
            $scope.nodesTableArr[i].isShowMessage = false;
        }
    };

    // concept nodes related operations ends here

    // view related functions.
    $scope.selectIndentationClass = function(node) {
        return 'level' + node.level;
    };

    $scope.hasDropdown = function(node) {
        return node.childCount > 0 ? "hasDropdown" : "noDropdown";
    };

    $scope.colorBackgroundOfNewNode = function(node) {
        return node.id == "";
    };


    $scope.toggleStatus = false;
    $scope.toggleDropdown = function(node) {
        node.toggleStatus = node.toggleStatus == true ? false : true;
        $scope.toggleStatus = node.toggleStatus;
        $scope.toggleDropdownHelper(node.id, $scope.toggleStatus);
    };

    $scope.toggleDropdownHelper = function(parentNodeId, toggleStatus) {
        for (var i = 0; i < $scope.nodesTableArr.length; i++) {
            var node = $scope.nodesTableArr[i];
            if (node.parentId == parentNodeId) {
                if (toggleStatus == false)
                    $scope.toggleDropdownHelper(node.id, toggleStatus);
                $scope.nodesTableArr[i].isShow = toggleStatus;
            }
        }
    };

    $scope.showAll = false;
    $scope.expandAll = function() {
        var i = 0;
        $scope.showAll = $scope.showAll == true ? false : true;
        if ($scope.showAll) {
            for (i = 0; i < $scope.nodesTableArr.length; i++)
                $scope.nodesTableArr[i]['isShow'] = true;
        } else {
            for (i = 0; i < $scope.nodesTableArr.length; i++)
                if ($scope.nodesTableArr[i]['level'] != 0)
                    $scope.nodesTableArr[i]['isShow'] = false;
        }
    };

    $scope.initializeTable = function(treeDataArr) {
        for (var i = 0; i < treeDataArr.length; i++) {
            var level = 0;
            var node = treeDataArr[i];
            if (node.children && node.children.length) {
                $scope.nodesTableArr.push({
                    name: node.name,
                    id: node._id,
                    parent: "root", // root : this is top level element
                    toggleStatus: false, // initially in collapsed state
                    parentId: -1, // -1 : this is a root element
                    isShow: true, // show hide row
                    isEditable: false,
                    level: level,
                    childCount: node.children.length,
                    isSaveBtn: false, // to show/hide save button
                    isUpdateBtn: false, // to show/hide update button
                    properties: node.properties // other properties you want to maintain about node
                });
            }
            if (node.children && node.children.length) { // if node is not leaf node then call helper function again
                $scope.initializeTableHelper(node.children, node.text, node._id, level);
            }

        }
    };

    $scope.initializeTableHelper = function(pChildArr, pParentName, pParentId, pLevel) {
        var isShowNode = false;
        pLevel = pLevel + 1;
        for (var i = 0; i < pChildArr.length; i++) {
            var node = pChildArr[i];
            var childCount = node.children != undefined ? node.children.length : 0;
            $scope.nodesTableArr.push({
                id: node._id,
                name: node.name,
                parent: pParentName,
                toggleStatus: false,
                parentId: pParentId,
                isShow: isShowNode,
                isEditable: false,
                level: pLevel,
                childCount: childCount,
                isSaveBtn: false,
                isUpdateBtn: false,
                properties: node.properties
            });
            if (node.children && node.children.length) {
                $scope.initializeTableHelper(node.children, node.text, node._id, pLevel);
            }
        }
    };

    $scope.nodesTableArr = [];
    var orgData = localStorage.getItem("orgData");
    orgData = JSON.parse(orgData);
    console.log('orgData', orgData);
    if (orgData == null) {
        $scope.initializeTable(sampleOrgData);
        localStorage.setItem("orgData", JSON.stringify($scope.nodesTableArr));
        console.log('$scope.nodesTableArr not present', $scope.nodesTableArr);
    } else {
        $scope.nodesTableArr = orgData;
        console.log('$scope.nodesTableArr already present', $scope.nodesTableArr);
    }


}])

app.factory('getLocalStorage', function() {
    var orgList = {};
    return {
        list: orgList,
        updateOrgData: function(orgArr) {
            if (window.localStorage && orgArr) {
                //Local Storage to add Data  
                localStorage.setItem("orgData", angular.toJson(orgArr));
            }
            orgList = orgArr;

        },
        getOrgData: function() {
            //Get data from Local Storage  
            orgList = angular.fromJson(localStorage.getItem("orgData"));
            return orgList ? orgList : [];
        }
    };

});
