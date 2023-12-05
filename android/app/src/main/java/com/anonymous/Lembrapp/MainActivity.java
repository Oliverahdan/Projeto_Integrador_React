package com.anonymous.Lembrapp;

import android.os.Build;
import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;

import expo.modules.ReactActivityDelegateWrapper;

public class MainActivity extends ReactActivity {
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    // Define o tema como AppTheme ANTES do onCreate para dar suporte à 
    // coloração do plano de fundo, barra de status e barra de navegação.
    // Isso é necessário para o expo-splash-screen.
    setTheme(R.style.AppTheme);
    super.onCreate(null);
  }

  /**
   * Retorna o nome do componente principal registrado no JavaScript.
   * Isso é usado para agendar a renderização do componente.
   */
  @Override
  protected String getMainComponentName() {
    return "main";
  }

  /**
   * Retorna a instância do {@link ReactActivityDelegate}. Aqui, usamos uma classe utilitária {@link
   * DefaultReactActivityDelegate} que permite habilitar facilmente o Fabric e o React Concurrent
   * (também conhecido como React 18) com duas flags booleanas.
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new ReactActivityDelegateWrapper(this, BuildConfig.IS_NEW_ARCHITECTURE_ENABLED, new DefaultReactActivityDelegate(
        this,
        getMainComponentName(),
        // Se você optou pela Nova Arquitetura, habilitamos o Fabric Renderer.
        DefaultNewArchitectureEntryPoint.getFabricEnabled()));
  }

  /**
   * Alinha o comportamento do botão Voltar com o Android S
   * onde as atividades raízes são movidas para segundo plano em vez de serem finalizadas.
   * @see <a href="https://developer.android.com/reference/android/app/Activity#onBackPressed()">onBackPressed</a>
   */
  @Override
  public void invokeDefaultOnBackPressed() {
    if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.R) {
      if (!moveTaskToBack(false)) {
        // Para atividades não raízes, use a implementação padrão para finalizá-las.
        super.invokeDefaultOnBackPressed();
      }
      return;
    }

    // Use a implementação padrão do botão Voltar no Android S
    // porque ela faz mais do que {@link Activity#moveTaskToBack} na verdade.
    super.invokeDefaultOnBackPressed();
  }
}
