"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es.promise.js");

var _antd = require("antd");

var _react = _interopRequireDefault(require("react"));

var _lodop = _interopRequireDefault(require("../utils/lodop"));

function getLodopAsync(retryLimit = 10, retryInterval = 150) {
  return new Promise((res, rej) => {
    let time = 0;

    const getIt = (resolve, reject) => {
      if (time > retryLimit) {
        reject({
          code: 500,
          message: "timeout"
        });
        return;
      }

      const lodop = (0, _lodop.default)();

      if (!lodop) {
        time++;
        setTimeout(() => getIt(resolve, reject), retryInterval);
      } else {
        resolve({
          code: 200,
          data: lodop
        });
        return;
      }
    };

    getIt(res, rej);
  });
}

const PrinterButton = ({
  onPrint
}) => {
  const [selectedKeys, setSelectedKeys] = _react.default.useState([]);

  const [printerList, setList] = _react.default.useState([]);

  const lodop = _react.default.useRef({});

  _react.default.useEffect(() => {
    getLodopAsync().then(res => {
      lodop.current = res.data;
      const count = lodop.current.GET_PRINTER_COUNT();
      const printerList = new Array(count).fill(null).map((_, index) => {
        return {
          name: lodop.current.GET_PRINTER_NAME(index),
          key: index,
          driver: lodop.current.GET_PRINTER_NAME(index + ":DriverName")
        };
      });
      setList(printerList);
    }).catch(e => {
      alert(e.message);
    });
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
    onClick: () => {
      onPrint && onPrint(selectedKeys[0]);
    },
    overlay: menu(selectedKeys)
  }, "\u6253\u5370"));
};

var _default = PrinterButton;
exports.default = _default;
