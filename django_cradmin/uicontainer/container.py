from __future__ import unicode_literals

from django.forms.utils import flatatt
from django_cradmin import renderable


class NotBootsrappedError(Exception):
    """
    Raised when trying to use features of
    :class:`.AbstractContainerRenderable`
    that requires is to have been bootstrapped.
    """


class AlreadyBootsrappedError(Exception):
    """
    Raised when trying to :meth:`~.AbstractContainerRenderable.bootstrap`
    and already bootstrapped :class:`.AbstractContainerRenderable`.
    """


class NotAllowedToAddChildrenError(Exception):
    """
    Raised when trying to add children to a :class:`.AbstractContainerRenderable`
    where :meth:`~.AbstractContainerRenderable.html_tag_supports_children`
    returns ``False``.
    """


class UnsupportedHtmlTagError(ValueError):
    """
    Raised when providing an invalid ``html_tag`` kwarg to :class:`.AbstractContainerRenderable`.

    See :obj:`.AbstractContainerRenderable.supported_html_tags`.
    """


class AbstractContainerRenderable(renderable.AbstractRenderableWithCss):
    """
    Base class for all renderables in the uicontainer framework.

    This can not be used directly. You extend it, and at least override
    :meth:`.get_default_html_tag`, or use one of the subclasses.

    The most basic subclass is :class:`django_cradmin.uicontainer.div.Div`.

    .. attribute:: parent

        The parent AbstractContainerRenderable. Set in :meth:`.bootstrap`.
        The attribute does not exist if :meth:`.bootstrap` has not been
        run. Is ``None`` if this is the root of the container tree.

    .. attribute:: properties

        A dict of properties. These properties is copied down to the
        ``properties`` attribute of children (with the update-method, not full replace)
        in :meth:`.bootstrap`.
        This means that you can add properties in ``__init__()``,
        and make them available to any children recursively.
    """
    template_name = 'django_cradmin/uicontainer/container.django.html'

    #: You can override this to specify a set of supported HTML tags
    #: for the ``html_tag`` attribute for :meth:`~.AbstractContainerRenderable.__init__`.
    #: This is useful to avoid typing errors. It should not be a big problem if you
    #: forget a tag that should be supported - developers can just create a subclass.
    #:
    #: If the value of this field is None, or any other value that is considered False by
    #: ``bool()``, we do not validate the ``html_tag`` kwarg.
    supported_html_tags = None

    def __init__(self, children=None,
                 bem_block=None, bem_element=None, bem_variants=None,
                 html_tag=None,
                 css_classes_list=None,
                 extra_css_classes_list=None,
                 test_css_class_suffixes_list=None,
                 role=False,
                 dom_id=False,
                 html_element_attributes=None):
        """
        Args:
            children: List of children. Children must be objects of subclasses
                of :class:`.AbstractContainerRenderable`.
            css_classes_list (list): Override the :meth:`default css classes <.get_default_css_classes_list>`
                with your own list of css classes.
            extra_css_classes_list (list): Add extra css classes. This is appended to
                the css classes in the ``css_classes_list`` kwarg if that is specified,
                or appended to the css classes returned by
                :meth:`.get_default_css_classes_list`.
            role (str): The value of the role attribute.
                If this is not specified, we fall back on the value returned
                by :meth:`.get_default_role`.
                If both is ``False``, we do not render the role attribute.
            dom_id (str): The value of the id attribute.
                If this is not specified, we fall back on the value returned
                by :meth:`.get_default_dom_id`.
                If both is ``False``, we do not render the id attribute.
            html_element_attributes (dict): HTML element attributes to add
                to the HTML element. This adds attributes returned
                by :meth:`.get_html_element_attributes`. If this dict includes
                attributes returned by :meth:`.get_html_element_attributes`,
                the attributes specified in this kwarg takes presedense.
                The format of the dict is specified in :meth:`.get_html_element_attributes`.

        """
        self.validate_html_tag(html_tag)
        self._childrenlist = []
        self._is_bootsrapped = False
        self.properties = {}
        self._overridden_role = role
        self._overridden_dom_id = dom_id
        self._overridden_html_tag = html_tag
        self._html_element_attributes = html_element_attributes
        self.add_children(*self.prepopulate_children_list())
        self.css_classes_list = css_classes_list
        self.test_css_class_suffixes_list = test_css_class_suffixes_list
        self.extra_css_classes_list = extra_css_classes_list
        if children:
            self.add_children(*children)

    def get_full_class_path_as_string(self):
        """
        Get full class path as string.

        Useful for providing some extra information in exceptions.
        Normally this will be in a traceback, but when dealing with
        things rendered by a Django template, this information is not
        always included.
        """
        return '{}.{}'.format(self.__class__.__module__, self.__class__.__name__)

    def validate_html_tag(self, html_tag):
        if html_tag and self.supported_html_tags and html_tag not in self.supported_html_tags:
            raise UnsupportedHtmlTagError('Unsupported HTML tag for {classpath}: {html_tag}'.format(
                classpath=self.get_full_class_path_as_string(),
                html_tag=self._overridden_html_tag
            ))

    def get_default_html_tag(self):
        """
        Get the default HTML tag to wrap renderable in.

        Can be overriden by the ``html_tag`` kwarg for :meth:`.__init__`.

        Returns ``"div"`` by default.
        """
        return 'div'

    @property
    def html_tag(self):
        """
        Get the HTML tag for this container.
        """
        return self._overridden_html_tag or self.get_default_html_tag()

    @property
    def html_tag_supports_children(self):
        """
        Does the html tag support children?

        If this returns ``False``, we:

        - Do not render an end tag for the wrapper element.
        - Do not allow children to be added to the container.

        Should be overridden to return ``False`` if the :meth:`.get_default_html_tag`
        does not allow for children. Examples of this case is if the
        wrapper html tag i ``input`` or ``hr``.

        See also :meth:`.can_have_children`, which should be used if the HTML tag
        should have and end tag, but not children.

        Returns:
            boolean: True by default.
        """
        return True

    @property
    def can_have_children(self):
        """
        Can this container have children?

        If this returns ``False``, :meth:`.add_child` will raise
        :class:`.NotAllowedToAddChildrenError`.

        Returns:
            boolean: The return value from :meth:`.html_tag_supports_children` by default.
        """
        return self.html_tag_supports_children

    def get_default_role(self):
        """
        Get the default value for the role attribute of the html element.

        Defaults to ``False``.
        """
        return False

    @property
    def role(self):
        """
        Get the value for the role attribute of the html element.

        You should not override this. Override :meth:`.get_default_role` instead.
        """
        return self._overridden_role or self.get_default_role()

    def get_default_dom_id(self):
        """
        Get the default value for the id attribute of the html element.

        Defaults to ``False``.
        """
        return False

    @property
    def dom_id(self):
        """
        Get the value for the id attribute of the html element.

        You should not override this. Override :meth:`.get_default_dom_id` instead.
        """
        return self._overridden_dom_id or self.get_default_dom_id()

    def get_html_element_attributes(self):
        """
        Get HTML element attributes as a dict.

        The dict is parsed by :func:`django.forms.utils.flatatt`,
        so:

        - ``{'myattribute': True}`` results in ``myattribute`` (no value).
        - ``{'myattribute': False}`` results in the attribute beeing ignored (not included in the output).
        - ``{'myattribute': 'Some value'}`` results in the ``myattribute="Some value"``.

        If you override this method, *remember to call super* to get
        the attributes set in the superclass.
        """
        return {
            'role': self.role,
            'id': self.dom_id,
            'class': self.css_classes or False,  # Fall back to false to avoid class=""
        }

    @property
    def html_element_attributes_string(self):
        """
        Get :meth:`.get_html_element_attributes` + any attributes in
        the ``html_element_attributes`` kwarg for :meth:`.__init__`
        encoded as a string using :func:`django.forms.utils.flatatt`.
        """
        html_element_attributes = dict(self.get_html_element_attributes())
        if self._html_element_attributes:
            html_element_attributes.update(self._html_element_attributes)
        return flatatt(html_element_attributes)

    def get_default_css_classes_list(self):
        """
        Override this to provide a default list of css classes.

        The css classes specified here can be overridden using
        the ``css_classes_list`` kwarg for :meth:`.__init__`.
        """
        return []

    def get_css_classes_list(self):
        """
        DO NOT OVERRIDE THIS METHOD.

        Unlike with :class:`django_cradmin.renderable.AbstractRenderableWithCss`,
        you do not override this class to add your own css classes. Override
        :meth:`.get_default_css_classes_list`.

        This is because this method respects the ``css_classes_list`` kwarg
        for :meth:`.__init__`, and just falls back to :meth:`.get_default_css_classes_list`.
        So if you override this method, the ``css_classes_list`` kwarg will be useless.
        """
        if self.css_classes_list:
            css_classes_list = self.css_classes_list
        else:
            css_classes_list = self.get_default_css_classes_list()
        if self.extra_css_classes_list:
            css_classes_list = list(css_classes_list)
            css_classes_list.extend(self.extra_css_classes_list)
        return css_classes_list

    def get_default_test_css_class_suffixes_list(self):
        """
        Override this to provide a default list of css classes for unit tests.

        The css classes specified here can be overridden using
        the ``test_css_class_suffixes_list`` kwarg for :meth:`.__init__`.
        """
        return []

    def get_test_css_class_suffixes_list(self):
        """
        DO NOT OVERRIDE THIS METHOD.

        Unlike with :class:`django_cradmin.renderable.AbstractRenderableWithCss`,
        you do not override this class to add your own test css classes. Override
        :meth:`.get_default_test_css_class_suffixes_list`.

        This is because this method respects the ``test_css_class_suffixes_list`` kwarg
        for :meth:`.__init__`, and just falls back to :meth:`.get_default_test_css_class_suffixes_list`.
        So if you override this method, the ``test_css_class_suffixes_list`` kwarg will be useless.
        """
        if self.test_css_class_suffixes_list:
            test_css_class_suffixes_list = self.test_css_class_suffixes_list
        else:
            test_css_class_suffixes_list = self.get_default_test_css_class_suffixes_list()
        return test_css_class_suffixes_list

    def bootstrap(self, parent=None):
        """
        Bootstrap the container.

        Must be called once on the top-level container
        in the tree of containers.

        Sets the provided parent as :attr:`.parent`.

        Updates the properties of all children (using dict update())
        with :attr:`.properties`.
        """
        if self._is_bootsrapped:
            raise AlreadyBootsrappedError('The container is already bootstrapped. Can not bootstrap '
                                          'the same container twice.')
        self.parent = parent
        if self.parent:
            self.properties.update(self.parent.properties)
        for child in self._childrenlist:
            child.bootstrap(parent=self)
        self._is_bootsrapped = True
        return self

    def prepopulate_children_list(self):
        """
        Pre-polulate the children list.

        This is called in :meth:`.__init__` before
        any children from the kwargs is added.

        Returns:
            list: An empty list by default, but you can override this
            in subclasses.
        """
        return []

    def add_child(self, childcontainer):
        """
        Add a child to the container.

        Args:
            childcontainer: A :class:`.AbstractContainerRenderable` object.

        Returns:
            A reference to self. This means that you can chain calls to this method.
        """
        if self.can_have_children:
            self._childrenlist.append(childcontainer)
            if self._is_bootsrapped and not childcontainer._is_bootsrapped:
                childcontainer.bootstrap(parent=self)
        else:
            raise NotAllowedToAddChildrenError('{modulename}.{classname} can not have children'.format(
                modulename=self.__class__.__module__,
                classname=self.__class__.__name__
            ))
        return self

    def add_children(self, *childcontainers):
        """
        Add children to the container.

        Args:
            *childcontainers: Zero or more :class:`.AbstractContainerRenderable` objects.

        Returns:
            A reference to self. This means that you can chain calls to this method.
        """
        for childcontainer in childcontainers:
            self.add_child(childcontainer)
        return self

    def iter_children(self):
        """
        Returns an iterator over the children of this container.

        The yielded children will be objects of :class:`.AbstractContainerRenderable`
        subclasses.
        """
        return iter(self._childrenlist)

    def get_childcount(self):
        """
        Get the number of children in the container.
        """
        return len(self._childrenlist)

    @property
    def should_render(self):
        """
        Should we render anything?

        Override this to make the :meth:`.render` to control
        if the container is rendered. If this returns ``False``,
        :meth:`.render` returns an empty string instead of
        rendering the template.

        Returns:
            bool: ``True`` by default, but subclasses can override this behavior.
        """
        return True

    def render(self, **kwargs):
        """
        Overrides :meth:`django_cradmin.renderable.AbstractRenderable.render`.
        The only change is that we return an empty string if
        :meth:`.should_render` returns ``False``. If it returns ``True``,
        we call the overriden method and returns the result.

        Args:
            **kwargs: Forwarded to the overridden method if it is called.
        """
        if not self._is_bootsrapped:
            raise NotBootsrappedError(
                'Can not render an AbstractContainerRenderable that has not been bootstrapped. '
                'Ensure you call bootsrap() on the top-level container in the container '
                'hierarchy before rendering.')
        if self.should_render:
            return super(AbstractContainerRenderable, self).render(**kwargs)
        else:
            return ''


class Div(AbstractContainerRenderable):
    """
    Renders a ``<div>``.

    The only thing this class does is to override
    :meth:`django_cradmin.uicontainer.container.AbstractContainerRenderable.get_default_html_tag`
    and return ``"div"``.
    """
    def get_default_html_tag(self):
        return 'div'
