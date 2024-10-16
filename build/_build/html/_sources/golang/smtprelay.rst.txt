Golang open smtp relay
======================

In this code I show how to send an Email using Go though an open SMTP relay. No auth, no SSL/TLS, no StartTLS.

This is modified code from https://pkg.go.dev/net/smtp


::

	package main

	/*
	This program send an email though an open, unecrypted SMTP relay.
	*/

	import (
		"fmt"
		"log"
		"net/smtp"
	)

	func main() {
		//Construct email https://pkg.go.dev/net/smtp
		to := "me@example.com"
		from := "go-alert@example.com"
		subject := "This is an example email from golang"
		body := "This email does not use SSL/TLS or StartTLS"
		smtpServer := "smtp.example.com"
		port := "25"

		//Formate email
		server := fmt.Sprintf("%s:%s", smtpServer, port)
		message := []byte(fmt.Sprintf("To: %s\r\nSubject: %s\r\n\r\n%s\r\n", to, subject, body))

		// Connect to the remote SMTP server.
		c, err := smtp.Dial(server)
		if err != nil {
			log.Fatal(err)
		}

		// Set the sender and recipient first
		if err := c.Mail(from); err != nil {
			log.Fatal(err)
		}
		if err := c.Rcpt(to); err != nil {
			log.Fatal(err)
		}

		// Send the email body.
		wc, err := c.Data()
		if err != nil {
			log.Fatal(err)
		}
		_, err = wc.Write(message)
		if err != nil {
			log.Fatal(err)
		}
		err = wc.Close()
		if err != nil {
			log.Fatal(err)
		}

		// Send the QUIT command and close the connection.
		err = c.Quit()
		if err != nil {
			log.Fatal(err)
		}

	}

You can also view this over on Github at https://github.com/Jamous/Golang_smtp_relay
