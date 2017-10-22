package com.ohacks.opportunityhacks;

import android.app.Dialog;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.os.Handler;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.ListView;
import android.widget.TextView;

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

        final Handler handler = new Handler();
        Runnable runnable = new Runnable() {
            @Override
            public void run() {
                try{
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

                            listView.setOnItemClickListener(new AdapterView.OnItemClickListener(){
                                @Override
                                public void onItemClick(AdapterView<?> parent, final View view, int position, long id){
                                    final String[] itemset = login.dogList.get(position);

                                    //set up item send
                                    final Dialog dialog = new Dialog(BroadcastActivity.this);
                                    dialog.setContentView(R.layout.activity_selected);

                                    TextView tvId = (TextView) dialog.findViewById(R.id.dialog_id);
                                    TextView tvName = (TextView) dialog.findViewById(R.id.dialog_name);
                                    TextView tvProfession = (TextView) dialog.findViewById(R.id.dialog_profession);

                                    tvId.setText(itemset[0]);
                                    tvName.setText(itemset[1]);
                                    tvProfession.setText(itemset[2]);

                                    Button dialogButton = (Button) dialog.findViewById(R.id.dialog_button);
                                    dialogButton.setOnClickListener(new View.OnClickListener(){
                                        @Override
                                        public void onClick(View v){
                                            dialog.dismiss();
                                        }
                                    });

                                    dialog.setTitle("Information");

                                    dialog.show();

                                    view.animate().setDuration(2000).alpha(0)
                                            .withEndAction(new Runnable() {
                                                @Override
                                                public void run() {
                                                    adapter.notifyDataSetChanged();
                                                    view.setAlpha(1);
                                                }
                                            });
                                }
                            });
                        }
                    }, 500);
                }
                catch (Exception e) {
                    // TODO: handle exception
                }
                finally{
                    //also call the same runnable to call it at regular interval
                    handler.postDelayed(this, 6000);
                }
            }
        };

        runnable.run();
    }

}