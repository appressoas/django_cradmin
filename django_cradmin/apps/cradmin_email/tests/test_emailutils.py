from django.core import mail
from django.test import TestCase
from django_cradmin.apps.cradmin_email import emailutils


class TestConvertHtmlToPlaintext(TestCase):
    def test_single_paragraph(self):
        self.assertEqual(
            emailutils.convert_html_to_plaintext('<p>Hello</p>').strip(),
            'Hello')

    def test_multiple_paragraphs(self):
        self.assertEqual(
            emailutils.convert_html_to_plaintext('<p>Hello</p><p>World</p>').strip(),
            'Hello\n\nWorld')

    def test_bold(self):
        self.assertEqual(
            emailutils.convert_html_to_plaintext('<strong>Hello</strong>').strip(),
            '**Hello**')

    def test_italic(self):
        self.assertEqual(
            emailutils.convert_html_to_plaintext('<em>Hello</em>').strip(),
            '_Hello_')

    def test_link(self):
        self.assertEqual(
            emailutils.convert_html_to_plaintext('<a href="http://example.com">Example</a>').strip(),
            '[Example](http://example.com)')

    def test_link_with_classes(self):
        self.assertEqual(
            emailutils.convert_html_to_plaintext('<a href="http://example.com" class="btn">Example</a>').strip(),
            '[Example](http://example.com)')


class TestAbstractEmail(TestCase):
    def test_subject(self):
        class MyEmail(emailutils.AbstractEmail):
            subject_template = 'cradmin_email_testapp/abstractemail/subject.django.txt'
            html_message_template = 'cradmin_email_testapp/abstractemail/html_message.django.html'

        MyEmail(recipient='test@example.com', extra_context_data={'name': 'Test'}).send()
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].subject, 'Hello, Test')

    def test_subject_prefix(self):
        class MyEmail(emailutils.AbstractEmail):
            subject_template = 'cradmin_email_testapp/abstractemail/subject.django.txt'
            html_message_template = 'cradmin_email_testapp/abstractemail/html_message.django.html'

        with self.settings(DJANGO_CRADMIN_EMAIL_SUBJECT_PREFIX='[Testbrand] '):
            MyEmail(recipient='test@example.com', extra_context_data={'name': 'Test'}).send()
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].subject, '[Testbrand] Hello, Test')

    def test_html_message(self):
        class MyEmail(emailutils.AbstractEmail):
            subject_template = 'cradmin_email_testapp/abstractemail/subject.django.txt'
            html_message_template = 'cradmin_email_testapp/abstractemail/html_message.django.html'

        MyEmail(recipient='test@example.com', extra_context_data={'name': 'Test'}).send()
        html_altenative = mail.outbox[0].alternatives[0]
        self.assertEqual(html_altenative[1], 'text/html')
        self.assertEqual(html_altenative[0].strip(), '<p>Hello</p><p>World</p><p>Test</p>')

    def test_plaintext_message_from_html_message(self):
        class MyEmail(emailutils.AbstractEmail):
            subject_template = 'cradmin_email_testapp/abstractemail/subject.django.txt'
            html_message_template = 'cradmin_email_testapp/abstractemail/html_message.django.html'

        MyEmail(recipient='test@example.com', extra_context_data={'name': 'Test'}).send()
        self.assertEqual(mail.outbox[0].body.strip(), 'Hello\n\nWorld\n\nTest')

    def test_plaintext_message_from_template(self):
        class MyEmail(emailutils.AbstractEmail):
            subject_template = 'cradmin_email_testapp/abstractemail/subject.django.txt'
            html_message_template = 'cradmin_email_testapp/abstractemail/html_message.django.html'
            plaintext_message_template = 'cradmin_email_testapp/abstractemail/plaintext_message.django.txt'

        MyEmail(recipient='test@example.com', extra_context_data={'name': 'Test'}).send()
        self.assertEqual(mail.outbox[0].body.strip(), 'Hello PlainText World Test')


class TestAbstractAdvancedEmail(TestCase):
    def test_reply_to(self):
        class MyEmail(emailutils.AbstractAdvancedEmail):
            subject_template = 'cradmin_email_testapp/abstractemail/subject.django.txt'
            html_message_template = 'cradmin_email_testapp/abstractemail/html_message.django.html'

        MyEmail(recipient='test@example.com',
                extra_context_data={'name': 'Test'},
                reply_to=('reply', 'reply@example.com')
                ).send()
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].subject, 'Hello, Test')
        self.assertEqual(mail.outbox[0].reply_to, ['reply', 'reply@example.com'])

    def test_reply_to_label_reply_to_email(self):
        class MyEmail(emailutils.AbstractAdvancedEmail):
            subject_template = 'cradmin_email_testapp/abstractemail/subject.django.txt'
            html_message_template = 'cradmin_email_testapp/abstractemail/html_message.django.html'

        MyEmail(recipient='test@example.com',
                extra_context_data={'name': 'Test'},
                reply_to_label='reply',
                reply_to_email='reply@example.com'
                ).send()
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].subject, 'Hello, Test')
        self.assertEqual(mail.outbox[0].reply_to, ['reply', 'reply@example.com'])

    def test_value_error_cannot_specify_both_reply_to_and_reply_to_list(self):
        class MyEmail(emailutils.AbstractAdvancedEmail):
            subject_template = 'cradmin_email_testapp/abstractemail/subject.django.txt'
            html_message_template = 'cradmin_email_testapp/abstractemail/html_message.django.html'

        with self.assertRaisesMessage(ValueError,
                                      'You can only specify one of the reply_to or reply_to_label and reply_to_email.'):
            MyEmail(recipient='test@example.com',
                    extra_context_data={'name': 'Test'},
                    reply_to_label='reply',
                    reply_to_email='reply@example.com',
                    reply_to=('reply', 'reply@example.com')
                    )

    def test_without_reply_to(self):
        class MyEmail(emailutils.AbstractAdvancedEmail):
            subject_template = 'cradmin_email_testapp/abstractemail/subject.django.txt'
            html_message_template = 'cradmin_email_testapp/abstractemail/html_message.django.html'

        MyEmail(recipient='test@example.com', extra_context_data={'name': 'Test'}).send()
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].subject, 'Hello, Test')
        self.assertEqual(mail.outbox[0].reply_to, [])

    def test_reply_to_only_reply_email(self):
        class MyEmail(emailutils.AbstractAdvancedEmail):
            subject_template = 'cradmin_email_testapp/abstractemail/subject.django.txt'
            html_message_template = 'cradmin_email_testapp/abstractemail/html_message.django.html'

        MyEmail(recipient='test@example.com',
                extra_context_data={'name': 'Test'},
                reply_to_email='reply@example.com'
                ).send()
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].subject, 'Hello, Test')
        self.assertEqual(mail.outbox[0].reply_to, [])

    def test_reply_to_only_reply_label(self):
        class MyEmail(emailutils.AbstractAdvancedEmail):
            subject_template = 'cradmin_email_testapp/abstractemail/subject.django.txt'
            html_message_template = 'cradmin_email_testapp/abstractemail/html_message.django.html'

        MyEmail(recipient='test@example.com',
                extra_context_data={'name': 'Test'},
                reply_to_label='reply'
                ).send()
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].subject, 'Hello, Test')
        self.assertEqual(mail.outbox[0].reply_to, [])
