/*
 * ______________                            ______ __________
 * __  ____/__  /__________ __________      ____  /____(_)_  /_____
 * _  /    __  /_  _ \  __ `/_  ___/_ | /| / /_  __ \_  /_  __/  _ \
 * / /___  _  / /  __/ /_/ /_  /   __ |/ |/ /_  / / /  / / /_ /  __/
 * \____/  /_/  \___/\__,_/ /_/    ____/|__/ /_/ /_//_/  \__/ \___/
 *                                         Lesson notes, clarified.
 * A “Zero to Hero” Project
 *   https://clearwhite.zerotohero.dev/
 * MIT License
 *   https://github.com/zerotohero-dev/clearwhite/blob/master/LICENSE.md
 */

const endsWithMarkdownRegExp = /\.md$/i;
const isMarkdown = a => a && endsWithMarkdownRegExp.test(a);

const endsWithTextRegExp = /\.txt$/i;
const isText = a => a && endsWithTextRegExp.test(a);

const dataPath = ({ path, file }) =>
  DATA_ROOT + `${path}/${file}`.replace(/\//g, SLASH) + '.html';

export { isMarkdown, isText, dataPath };
