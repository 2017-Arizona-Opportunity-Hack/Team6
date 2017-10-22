package com.ohacks.opportunityhacks;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.os.Handler;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.widget.ArrayAdapter;
import android.widget.ListView;

import java.util.ArrayList;
import java.util.List;


public class BroadcastActivity extends AppCompatActivity {
    SharedPreferences sharedPreferences;

    ListView listView;
    ArrayAdapter<String> adapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_broadcast);

        listView = (ListView) findViewById(R.id.listView);

        sharedPreferences = getSharedPreferences(getResources().getString(R.string.preferences), Context.MODE_PRIVATE);

        final HttpRequest login = new HttpRequest(sharedPreferences);
        String username = sharedPreferences.getString("login_username", "");
        String pass = sharedPreferences.getString("login_password", "");
        login.login(username, pass);
        login.runRequestSessionMem();

        Handler handler = new Handler();
        handler.postDelayed(new Runnable() {
            public void run() {
                System.out.println(login.dogList);

                // init new list
                List<String> dogNames = new ArrayList<String>();
                for (int i = 0; i < login.dogList.size(); i++)
                    dogNames.add(login.dogList.get(i)[0]);

                // add data to the list
                adapter = new ArrayAdapter<String>(getApplicationContext(), android.R.layout.simple_list_item_1, dogNames);
                listView.setAdapter(adapter);
            }
        }, 1000);
    }

}