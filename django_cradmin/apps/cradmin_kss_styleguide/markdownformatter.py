import markdown
from bs4 import BeautifulSoup


class MarkdownFormatter(object):
    markdown_extensions = [
        # Break into new ul/ol tag when the next line starts with another class of list indicator
        'sane_lists',

        # Do not let hello_world create an <em>,
        'smart_strong',

        # Support definition lists
        'def_list',

        # Support tables
        'tables',

        # The SmartyPants extension converts ASCII dashes, quotes and ellipses to their HTML entity equivalents.
        'smarty',

        # Makes it possible to hilight code like in github markdown
        'codehilite',
        'fenced_code',
    ]

    @classmethod
    def to_html(cls, markdowntext):
        return cls(markdowntext=markdowntext).resulthtml

    def __init__(self, markdowntext):
        markdowntext = self.preprocess_markdowntext(markdowntext=markdowntext)
        html = self.process_html(markdowntext=markdowntext)
        self.resulthtml = self.postprocess_html(html=html)

    def preprocess_markdowntext(self, markdowntext):
        return markdowntext

    def process_html(self, markdowntext):
        md = markdown.Markdown(
            output_format='html5',
            extensions=self.markdown_extensions)
        return md.convert(markdowntext)

    def _make_h1_h3(self, html):
        soup = BeautifulSoup(html, 'html5lib')
        for headerlevel in (3, 2, 1):
            for element in soup.find_all('h{}'.format(headerlevel)):
                element.name = 'h{}'.format(headerlevel + 2)
        return soup.prettify(encoding='utf-8')

    def postprocess_html(self, html):
        return self._make_h1_h3(html)
