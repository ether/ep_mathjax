'use strict';

const eejs = require('ep_etherpad-lite/node/eejs');

exports.eejsBlock_editbarMenuLeft = (hookName, args, cb) => {
  args.content += eejs.require('ep_mathjax/templates/editbarButtons.ejs', {}, module);
  return cb();
};

exports.eejsBlock_editorContainerBox = (hookName, args, cb) => {
  args.content += eejs.require('ep_mathjax/templates/modals.ejs', {}, module);
  return cb();
};

exports.eejsBlock_scripts = (hookName, args, cb) => {
  args.content += eejs.require('ep_mathjax/templates/scripts.ejs', {}, module);
  return cb();
};

exports.eejsBlock_styles = (hookName, args, cb) => {
  args.content += eejs.require('ep_mathjax/templates/styles.ejs', {}, module);
  return cb();
};
