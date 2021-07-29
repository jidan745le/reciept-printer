"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _antd = require("antd");

var _react = _interopRequireDefault(require("react"));

var _lodop = _interopRequireDefault(require("../utils/lodop"));

const PrinterButton = () => {
  const [selectedKeys, setSelectedKeys] = _react.default.useState([]);

  const [printerList, setList] = _react.default.useState([]);

  const lodop = _react.default.useRef({});

  _react.default.useEffect(() => {
    lodop.current = (0, _lodop.default)();
    const count = lodop.current.GET_PRINTER_COUNT();
    const printerList = new Array(count).fill(null).map((_, index) => {
      return {
        name: lodop.GET_PRINTER_NAME(index),
        key: lodop.GET_PRINTER_NAME(index + ":DriverName")
      };
    });
    setList(printerList);
  }, []);

  function handleMenuClick(e) {
    setSelectedKeys([e.key]);
  }

  const menu = selectedKeys => /*#__PURE__*/_react.default.createElement(_antd.Menu, {
    selectedKeys: selectedKeys,
    onClick: handleMenuClick
  }, printerList.map(({
    name,
    key
  }) => {
    return /*#__PURE__*/_react.default.createElement(_antd.Menu.Item, {
      key: key
    }, name);
  }));

  return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_antd.Dropdown.Button, {
    placement: "topCenter",
    onClick: () => _antd.message.success("直接打印"),
    overlay: menu(selectedKeys)
  }, "\u6253\u5370"));
};

var _default = PrinterButton;
exports.default = _default;
