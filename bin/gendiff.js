#!/usr/bin/env node
import { Command } from 'commander';
import gendiff from '../index.js';

const program = new Command();
program
  .version('1.0.0')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format <type>', 'output format')
  .arguments('<filepath1> <filepath2>')
  .action((file1, file2) => {
    if (program.opts().format === undefined || program.opts().format.toLowerCase() === 'stylish') {
      console.log(gendiff(file1, file2));
    } else if (program.opts().format.toLowerCase() === 'json') {
      console.log(gendiff(file1, file2, 'json'));
    } else if (program.opts().format.toLowerCase() === 'plain') {
      console.log(gendiff(file1, file2, 'plain'));
    }
  })
  .parse(process.argv);
