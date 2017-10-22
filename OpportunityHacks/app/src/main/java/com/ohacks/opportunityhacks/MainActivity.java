
package com.ohacks.opportunityhacks;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.os.AsyncTask;
import android.os.Handler;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.loopj.android.http.HttpGet;
import com.loopj.android.http.JsonHttpResponseHandler;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

import cz.msebera.android.httpclient.Header;
import cz.msebera.android.httpclient.HttpEntity;
import cz.msebera.android.httpclient.HttpResponse;
import cz.msebera.android.httpclient.NameValuePair;
import cz.msebera.android.httpclient.client.entity.UrlEncodedFormEntity;
import cz.msebera.android.httpclient.client.methods.HttpPost;
import cz.msebera.android.httpclient.cookie.Cookie;
import cz.msebera.android.httpclient.impl.client.DefaultHttpClient;
import cz.msebera.android.httpclient.message.BasicNameValuePair;
import cz.msebera.android.httpclient.protocol.HTTP;

public class MainActivity extends AppCompatActivity {
    EditText username;
    EditText password;
    Button submitButton;
    Button signupButton;
    TextView errorMessage;

    SharedPreferences sharedPreferences;

    int code = 1;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // initialize variables
        username = (EditText) findViewById(R.id.username);
        password = (EditText) findViewById(R.id.password);
        submitButton = (Button) findViewById(R.id.signupbutton);
        signupButton = (Button) findViewById(R.id.joinUs);
        errorMessage = (TextView) findViewById(R.id.errormessage);

        sharedPreferences = getSharedPreferences(getResources().getString(R.string.preferences), Context.MODE_PRIVATE);

        addSubmitButtonListener();
        addSignupButtonListener();
    }

    // action listeners

    public void addSignupButtonListener(){
        signupButton.setOnClickListener(new View.OnClickListener(){
            @Override
            public void onClick(View v){
                Intent intent = new Intent(getApplicationContext(), SignupActivity.class);
                startActivity(intent);
            }
        });
    }

    public void addSubmitButtonListener(){
        submitButton.setOnClickListener(new View.OnClickListener(){
            @Override
            public void onClick(View v){
                String name = username.getText().toString();
                String pass = password.getText().toString();

                final HttpRequest login = new HttpRequest(sharedPreferences);
                login.runRequest(name, pass, code);

                Handler handler = new Handler();
                handler.postDelayed(new Runnable() {
                    public void run() {
                        boolean reqTest = login.getSuccessful();

                        if (reqTest) {
                            // if request successful
                            Intent intent = new Intent(getApplicationContext(), BroadcastActivity.class);
                            startActivity(intent);
                        } else{
                            errorMessage.setTextColor(Color.RED);
                            errorMessage.setText("Incorrect username or password");
                        }
                    }
                }, 1000);
            }
        });
    }


}
