"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _antd = require("antd");

var _react = _interopRequireDefault(require("react"));

const PrinterButton = () => {
  const [selectedKeys, setSelectedKeys] = _react.default.useState([]);

  function handleMenuClick(e) {
    setSelectedKeys([e.key]);
  }

  const menu = selectedKeys => /*#__PURE__*/_react.default.createElement(_antd.Menu, {
    selectedKeys: selectedKeys,
    onClick: handleMenuClick
  }, /*#__PURE__*/_react.default.createElement(_antd.Menu.Item, {
    key: "1"
  }, "\u6253\u5370\u673A1"), /*#__PURE__*/_react.default.createElement(_antd.Menu.Item, {
    key: "2"
  }, "\u6253\u5370\u673A2"), /*#__PURE__*/_react.default.createElement(_antd.Menu.Item, {
    key: "3"
  }, "\u6253\u5370\u673A3"));

  return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_antd.Dropdown.Button, {
    onClick: () => _antd.message.success("直接打印"),
    overlay: menu(selectedKeys)
  }, "\u6253\u5370"));
};

var _default = PrinterButton;
exports.default = _default;
