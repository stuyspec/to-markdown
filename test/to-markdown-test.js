if (typeof module !== 'undefined' && module.exports) {
  var toMarkdown = require('../index');
}

QUnit.module('Markdown');

test('paragraphs', function() {
  equal(toMarkdown('<p>Lorem ipsum</p>'), 'Lorem ipsum', 'We expect p tags to be wrapped with two line breaks');
  equal(toMarkdown('<p class="intro">Lorem ipsum</p>'), 'Lorem ipsum', 'We expect p tags to be wrapped with two line breaks');
});

test('emphasis', function() {
  equal(toMarkdown('<b>Hello world</b>'), '**Hello world**', 'We expect <b>Hello world</b> to be converted to **Hello world**');
  equal(toMarkdown('<strong>Hello world</strong>'), '**Hello world**', 'We expect <strong>Hello world</strong> to be converted to **Hello world**');
  equal(toMarkdown('<b></b>'), '', 'We expect b tags to be removed');

  equal(toMarkdown('<i>Hello world</i>'), '_Hello world_', 'We expect <i>Hello world</i> to be converted to _Hello world_');
  equal(toMarkdown('<em>Hello world</em>'), '_Hello world_', 'We expect <em>Hello world</em> to be converted to _Hello world_');
  equal(toMarkdown('<em id="one" class="cowabunga">Hello world</em>'), '_Hello world_', 'We expect <em id="one" class="cowabunga">Hello world</em> to be converted to _Hello world_');
  equal(toMarkdown('<em id="one" class="cowabunga"></em>'), '', 'We expect empty em tags to be removed');
});

test('extra-emphasis', function() {
    equal(toMarkdown('<del>I am deleted</del>'), '~~I am deleted~~', 'We expect <del>I am deleted</del> to be converted to ~~I am deleted~~');
    equal(toMarkdown('19<sup>th</sup>'), '19^th^', 'We expect 19<sup>th</sup> to be converted to 19^th^');
    equal(toMarkdown('H<sub>2</sub>O'), 'H~2~O', 'We expect H<sub>2</sub>O to be converted to H~2~O');
    equal(toMarkdown('<ins>I am inserted</ins>'), '++I am inserted++', 'We expect <ins>I am inserted</ins> to be converted to ++I am inserted++');
    equal(toMarkdown('<mark>I am marked</mark>'), '==I am marked==', 'We expect <mark>I am marked</mark> to be converted to ==I am marked==');
})

test('code', function() {
  equal(toMarkdown('<code>print()</code>'), '`print()`', 'We expect inline code tags to be converted to backticks');
  equal(toMarkdown('<code></code>'), '', 'We expect empty code tags to be removed');
});

test('headings', function() {
  equal(toMarkdown('<h1>Hello world</h1>'), '# Hello world', 'We expect <h1>Hello world</h1> to be converted to # Hello world');
  equal(toMarkdown('<h3>Hello world</h3>'), '### Hello world', 'We expect <h3>Hello world</h3> to be converted to ### Hello world');
  equal(toMarkdown('<h6>Hello world</h6>'), '###### Hello world', 'We expect <h6>Hello world</h6> to be converted to ###### Hello world');
  equal(toMarkdown('<h4><i>Hello</i> world</h4>'), '#### _Hello_ world', 'We expect <h4><i>Hello</i> world</h4> to be converted to #### _Hello_ world');

  equal(toMarkdown('<h8>Hello world</h8>'), '<h8>Hello world</h8>', 'We expect <h8>Hello world</h8> to be converted to <h8>Hello world</h8>');
});

test('horizontal rules', function() {
  equal(toMarkdown('<hr />'), '* * *', 'We expect hr elements to be converted to * * *');
  equal(toMarkdown('<hr/>'), '* * *', 'We expect hr elements to be converted to * * *');
  equal(toMarkdown('<hr>'), '* * *', 'We expect hr elements to be converted to * * *');
  equal(toMarkdown('<hr class="fancy" />'), '* * *', 'We expect hr elements to be converted to * * *');
  equal(toMarkdown('<hr></hr>'), '* * *', 'We expect hr elements to be converted to * * *');
});

test('line breaks', function() {
  equal(toMarkdown('Hello<br />world'), 'Hello  \nworld', 'We expect br elements to be converted to   \n');
  equal(toMarkdown('Hello<br/>world'), 'Hello  \nworld', 'We expect br elements to be converted to   \n');
  equal(toMarkdown('Hello<br>world'), 'Hello  \nworld', 'We expect br elements to be converted to   \n');
});

test('images', function() {
  equal(toMarkdown('<img src="http://example.com/logo.png" />'), '![](http://example.com/logo.png)', 'We expect img elements to be converted properly');
  equal(toMarkdown('<img src="http://example.com/logo.png" />'), '![](http://example.com/logo.png)', 'We expect img elements to be converted properly');
  equal(toMarkdown('<img src="http://example.com/logo.png">'), '![](http://example.com/logo.png)', 'We expect img elements to be converted properly');
  equal(toMarkdown('<img src=http://example.com/logo.png>'), '![](http://example.com/logo.png)', 'We expect img elements to be converted properly');

  equal(toMarkdown('<img src=logo.png>'), '![](logo.png)', 'We expect img elements to be converted properly');

  equal(toMarkdown('<img src="http://example.com/logo.png" alt="Example logo" />'), '![Example logo](http://example.com/logo.png)', 'We expect img elements to be converted properly with alt attrs');
  equal(toMarkdown('<img src="http://example.com/logo.png" alt="Example logo" title="Example title" />'), '![Example logo](http://example.com/logo.png "Example title")', 'We expect img elements to be converted properly with alt and title attrs');
  equal(toMarkdown('<img>'), '', 'We expect an image with no src to be removed.');
});

test('anchors', function() {
  equal(toMarkdown('<a href="http://example.com/about">About us</a>'), '[About us](http://example.com/about)', 'We expect anchor elements to be converted properly');
  equal(toMarkdown('<a href="http://www.example.com/about" title="About this company">About us</a>'), '[About us](http://www.example.com/about "About this company")', 'We expect an anchor element with a title tag to have correct markdown');
  equal(toMarkdown('<a class="some really messy stuff" href="/about" id="donuts3" title="About this company">About us</a>'), '[About us](/about "About this company")', 'We expect an anchor element with a title tag to have correct markdown');
  equal(toMarkdown('<a id="donuts3">About us</a>'), '<a id="donuts3">About us</a>', 'Anchor tags without an href should not be converted');
});

test('pre/code blocks', function() {
  var codeHtml = [
    '<pre><code>def hello_world',
    '  # 42 &lt; 9001',
    '  "Hello world!"',
    'end</code></pre>'
  ],
  codeMd = [
    '    def hello_world',
    '      # 42 < 9001',
    '      "Hello world!"',
    '    end'
  ];
  equal(toMarkdown(codeHtml.join('\n')), codeMd.join('\n'), 'We expect code blocks to be converted');

  codeHtml = [
    '<pre><code>def foo',
    '  # 42 &lt; 9001',
    '  \'Hello world!\'',
    'end</code></pre>',
    '<p>next:</p>',
    '<pre><code>def bar',
    '  # 42 &lt; 9001',
    '  \'Hello world!\'',
    'end</code></pre>'
  ].join('\n');

  codeMd = [
    '    def foo',
    '      # 42 < 9001',
    '      \'Hello world!\'',
    '    end',
    '',
    'next:',
    '',
    '    def bar',
    '      # 42 < 9001',
    '      \'Hello world!\'',
    '    end'
  ].join('\n');
  equal(toMarkdown(codeHtml), codeMd, 'We expect multiple code blocks to be converted');

  var preBlock = '<pre>preformatted</pre>';
  equal(toMarkdown(preBlock), preBlock, 'We expect pre blocks containing no code to be converted');
});

test('lists', function() {
  equal(toMarkdown('1986. What a great season.'), '1986\\. What a great season.','We expect numbers that could trigger an ol to be escaped');
  equal(toMarkdown('<ol>\n\t<li>Hello world</li>\n\t<li>Lorem ipsum</li>\n</ol>'), '1.  Hello world\n2.  Lorem ipsum', 'We expect ol elements to be converted properly');
  equal(toMarkdown('<ul>\n\t<li>Hello world</li>\n\t<li>Lorem ipsum</li>\n</ul>'), '*   Hello world\n*   Lorem ipsum', 'We expect ul elements with line breaks and tabs to be converted properly');
  equal(toMarkdown('<ul class="blargh"><li class="first">Hello world</li><li>Lorem ipsum</li></ul>'), '*   Hello world\n*   Lorem ipsum', 'We expect ul elements with attributes to be converted properly');
  equal(toMarkdown('<ul><li>Hello world</li><li>Lorem ipsum</li></ul><ul><li>Hello world</li><li>Lorem ipsum</li></ul>'), '*   Hello world\n*   Lorem ipsum\n\n*   Hello world\n*   Lorem ipsum', 'We expect multiple ul elements to be converted properly');
  equal(toMarkdown('<ul><li><p>Hello world</p></li><li>Lorem ipsum</li></ul>'), '*   Hello world\n\n*   Lorem ipsum', 'We expect li elements with ps to be converted properly');

  var lisWithPsHtml = [
    '<ol>',
    '  <li>',
    '    <p>This is a list item with two paragraphs. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus.</p>',
    '    <p>Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus. Donec sit amet nisl. Aliquam semper ipsum sit amet velit.</p>',
    '  </li>',
    '  <li>',
    '    <p>Suspendisse id sem consectetuer libero luctus adipiscing.</p>',
    '  </li>',
    '</ol>'
  ].join('\n'),

  lisWithPsMd = [
    '1.  This is a list item with two paragraphs. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus.',
    '',
    '    Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus. Donec sit amet nisl. Aliquam semper ipsum sit amet velit.',
    '',
    '2.  Suspendisse id sem consectetuer libero luctus adipiscing.'
  ].join('\n');

  equal(toMarkdown(lisWithPsHtml), lisWithPsMd,'We expect lists with paragraphs to be converted');

  var nestedListHtml = [
    '<ul>',
    '  <li>This is a list item at root level</li>',
    '  <li>This is another item at root level</li>',
    '  <li>',
    '    <ul>',
    '      <li>This is a nested list item</li>',
    '      <li>This is another nested list item</li>',
    '      <li>',
    '        <ul>',
    '          <li>This is a deeply nested list item</li>',
    '          <li>This is another deeply nested list item</li>',
    '          <li>This is a third deeply nested list item</li>',
    '        </ul>',
    '      </li>',
    '    </ul>',
    '  </li>',
    '  <li>This is a third item at root level</li>',
    '</ul>'
  ].join('\n'),
  nestedListMd = [
    '*   This is a list item at root level',
    '*   This is another item at root level',
    '*   *   This is a nested list item',
    '    *   This is another nested list item',
    '    *   *   This is a deeply nested list item',
    '        *   This is another deeply nested list item',
    '        *   This is a third deeply nested list item',
    '*   This is a third item at root level'
  ].join('\n');
  equal(toMarkdown(nestedListHtml), nestedListMd, 'We expect nested lists to be converted properly');

  nestedListHtml = [
    '<ul>',
    '  <li>This is a list item at root level</li>',
    '  <li>This is another item at root level</li>',
    '  <li>',
    '    <ol>',
    '      <li>This is a nested list item</li>',
    '      <li>This is another nested list item</li>',
    '      <li>',
    '        <ul>',
    '          <li>This is a deeply nested list item</li>',
    '          <li>This is another deeply nested list item</li>',
    '          <li>This is a third deeply nested list item</li>',
    '        </ul>',
    '      </li>',
    '    </ol>',
    '  </li>',
    '  <li>This is a third item at root level</li>',
    '</ul>'
  ].join('\n');
  nestedListMd = [
    '*   This is a list item at root level',
    '*   This is another item at root level',
    '*   1.  This is a nested list item',
    '    2.  This is another nested list item',
    '    3.  *   This is a deeply nested list item',
    '        *   This is another deeply nested list item',
    '        *   This is a third deeply nested list item',
    '*   This is a third item at root level'
  ].join('\n');
  equal(toMarkdown(nestedListHtml), nestedListMd, 'We expect nested lists to be converted properly');

  var html = [
    '<ul>',
    '  <li>',
    '    <p>A list item with a blockquote:</p>',
    '    <blockquote>',
    '      <p>This is a blockquote inside a list item.</p>',
    '    </blockquote>',
    '  </li>',
    '</ul>'
  ].join('\n');
  var md = [
    '*   A list item with a blockquote:',
    '',
    '    > This is a blockquote inside a list item.'
  ].join('\n');

  equal(toMarkdown(html), md, 'We expect lists with blockquotes to be converted');
});

test('blockquotes', function() {
  var html = [
    '<blockquote>',
    '  <p>This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus. Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.</p>',
    '',
    '  <p>Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse id sem consectetuer libero luctus adipiscing.</p>',
    '</blockquote>'
  ].join('\n');
  var md = [
    '> This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus. Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.',
    '> ',
    '> Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse id sem consectetuer libero luctus adipiscing.'
  ].join('\n');
  equal(toMarkdown(html), md, 'We expect blockquotes with two paragraphs to be converted');

  html = [
    '<blockquote>',
    '  <p>This is the first level of quoting.</p>',
    '',
    '  <blockquote>',
    '    <p>This is nested blockquote.</p>',
    '  </blockquote>',
    '',
    '  <p>Back to the first level.</p>',
    '</blockquote>'
  ].join('\n');
  md = [
    '> This is the first level of quoting.',
    '> ',
    '> > This is nested blockquote.',
    '> ',
    '> Back to the first level.'
  ].join('\n');
  equal(toMarkdown(html), md, 'We expect nested blockquotes to be converted');

  html = [
    '<blockquote>',
    '  <h2>This is a header.</h2>',
    '  <ol>',
    '    <li>This is the first list item.</li>',
    '    <li>This is the second list item.</li>',
    '  </ol>',
    '  <p>Here\'s some example code:</p>',
    '  <pre><code>return 1 &lt; 2 ? shell_exec(\'echo $input | $markdown_script\') : 0;</code></pre>',
    '</blockquote>'
  ].join('\n');
  md = [
    '> ## This is a header.',
    '> ',
    '> 1.  This is the first list item.',
    '> 2.  This is the second list item.',
    '> ',
    '> Here\'s some example code:',
    '> ',
    '>     return 1 < 2 ? shell_exec(\'echo $input | $markdown_script\') : 0;'
  ].join('\n');
  strictEqual(toMarkdown(html), md, 'We expect html in blockquotes to be converted');
});

test('comments', function () {
  equal(toMarkdown('<!-- comment -->'), '', 'We expect comment nodes to be removed.');
});

test('leading/trailing whitespace', function() {
  var html, md;

  html = '<p>I <a href="http://example.com">need</a> <a href="http://www.example.com">more</a> spaces!</p>';
  md = 'I [need](http://example.com) [more](http://www.example.com) spaces!';
  equal(toMarkdown(html), md, 'Inline elements');

  html = [
    '<h1>',
    '    Some header text</h1>'
  ].join('\n');
  equal(toMarkdown(html), '# Some header text', 'We expect leading whitespace to be removed');

  html = [
    '<ol>',
    '  <li>Chapter One',
    '    <ol>',
    '      <li>Section One</li>',
    '      <li>Section Two </li>',
    '      <li>Section Three </li>',
    '    </ol>',
    '  </li>',
    '  <li>Chapter Two</li>',
    '  <li>Chapter Three  </li>',
    '</ol>'
  ].join('\n');

  md = [
    '1.  Chapter One',
    '    1.  Section One',
    '    2.  Section Two',
    '    3.  Section Three',
    '2.  Chapter Two',
    '3.  Chapter Three'
  ].join('\n');
  equal(toMarkdown(html), md, 'We expect trailing whitespace to be removed');

  var lisWithTrailingWhitespaceHtml = [
    '<ul>',
    '  <li>Hello world. </li>', // Sentences
    '  <li>Lorem   </li>', // Phrases
    '  <li>Take 5 </li>', // Numbers
    '  <li>Foo!   </li>', // Special Characters
    '  <li>', // Multilined
    '    Bar ',
    '  </li>',
    '  <li>', // Bizarre formatting
    '    <strong>Buz </strong> </li>',
    '  <li>Anchor</li>',
    '</ul>',
    '<ol>',
    '  <li> first text',
    '                      some text',
    '  </li>',
    '</ol>'].join('\n');

  lisWithTrailingWhitespaceMd = [
    '*   Hello world.',
    '*   Lorem',
    '*   Take 5',
    '*   Foo!',
    '*   Bar',
    '*   **Buz**',
    '*   Anchor',
    '',
    '1.  first text some text'
  ].join('\n');

  equal(toMarkdown(lisWithTrailingWhitespaceHtml), lisWithTrailingWhitespaceMd, 'We expect list items with trailing whitespace to be converted');
});

asyncTest('img[onerror]', 1, function () {
  start();
  equal(toMarkdown('>\'>"><img src=x onerror="(function () { ok(true); })()">'), '>\'>">![](x)', 'We expect img[onerror] functions not to run');
});
